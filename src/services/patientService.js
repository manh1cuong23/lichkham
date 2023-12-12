import db from '../models/index';
require('dotenv').config()
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';

function buidUrlEmail(doctorId,token){
    let result='';
    result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

class patientService{
    
    postBookAppointmentService(data){
        return new Promise(async (resolve, reject) =>{
            try{
                if(!data.email || !data.doctorId || !data.timeType || !data.date 
                    || !data.fullName || !data.selectedGender || !data.address
                    ){ 
                    resolve({
                        errCode:1 ,
                        errMessage:'Missing required parameters'
                    })
                }else{
                    // resolve({
                    //     data:data
                    // })
                    let token = uuidv4();
                    await emailService.sendSimpleEmail({
                        reciverEmail: data.email,
                        patientName:data.fullName,
                        time:data.timeString,
                        doctorName:data.doctorName,
                        language:data.language,
                        redirectLink: buidUrlEmail(data.doctorId,token)
                    })
                    let user =  await db.User.findOrCreate({
                        where:{email:data.email},
                        defaults:{
                            email:data.email,
                            roleId:'R3',
                            gender:data.selectedGender,
                            address:data.address,
                            firstName:data.fullName,
                        }
                        
                    })
                    console.log('User created',user[0])
                    if(user && user[0]){
                        await db.Booking.findOrCreate({
                            where:{patientId:user[0].id},
                            defaults:{
                                statusId:'S1',
                                doctorId:data.doctorId,
                                patientId:user[0].id,
                                date:data.date,
                                timeType:data.timeType,
                                token:token

                            }
                        })
                    }
                    resolve({
                        errCode: 0 ,
                        
                        errMessage:'Succcess'
                    })
                }
            }
            catch(e){
                reject(e);
            }
        })
    }
    postVerifyBookAppointmentService(data){
        return new Promise(async (resolve, reject) =>{
            try{
                if(!data.token || !data.doctorId 
                    ){
                    resolve({
                        errCode:1 ,
                        errMessage:'Missing required parameters'
                    })
                }else{
                    let appointment = await db.Booking.findOne({
                        where:{
                            doctorId:data.doctorId,
                            token:data.token,
                            statusId:'S1'
                        },
                        raw:false
                    })
                    if(appointment){
                        appointment.statusId = 'S2'
                        await appointment.save()
                        resolve({
                            errCode: 0 ,
                            errMessage:'Update the appointment success'
                        })
                    }else{
                        resolve({
                            errCode: 2 ,
                            errMessage:'appointment already exists'
                        })
                    }
                }
                   
                
            }
            catch(e){
                reject(e);
            }
        })
    }
    
    
   
}
module.exports = new patientService