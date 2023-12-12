import db from '../models/index';
require('dotenv').config()
import _ from 'lodash'
import emailService from './emailService'
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
class doctorService{
    getTopDoctorHome(limit){
        return new Promise(async (resolve, reject) =>{
            try{
                let users = await db.User.findAll({
                    limit:limit,
                    where:{roleId:'R2'},
                    order:[
                        ["createdAt","DESC"]
                    ],
                    attributes:{
                        exclude:["password"]
                    },
                    include:[
                        {model:db.Allcode,as:'positionData', attributes:['valueEn','valueVi'],},
                        {model:db.Allcode,as:'genderData', attributes:['valueEn','valueVi'],}

                    ],
                    raw:true,
                    nest: true
                })
                resolve({
                    errCode:0,
                    data:users
                })
            }catch(e){
                reject(e);
            }
        })
    }
    getAllDoctor(){
        return new Promise(async (resolve, reject) =>{
            try{
                let doctors = await  db.User.findAll({
                    where:{roleId:'R2'},
                    attributes:{
                        exclude:['password','image']
                    }
                })
                if(doctors){
                    resolve({
                        errCode:0,
                        data: doctors
                    })

                }else{
                    resolve({
                        errCode:1,
                        errMessage:'Cannt find all'
                    })
                }
            }catch(e){
                reject(e);
            }
        })
    }
    saveDetailInforDoctor(data){
        console.log('data sever',data)
        return new Promise(async (resolve, reject) =>{
            try{
               
                if(!data.doctorId || !data.contentHTML || !data.contentMarkdown
                    || !data.SelectedPrice|| !data.SelectedProvince|| !data.nameClinic
                    || !data.addressClinic
                    || !data.note    || !data.specialtyId
                    
                ){
                    resolve({
                        errCode:1,
                        errMessage:"mising parrams methd"    
                    })
                }else{
                    if(data.action === 'CREATE'){
                        let doctors = await db.Markdown.create({
                            contentHTML:data.contentHTML,
                            contentMarkdown:data.contentMarkdown,
                            description: data.description,
                            doctorId: data.doctorId
                        })
                    }else if(data.action === 'EDIT'){
                        let doctorMarkDown = await db.Markdown.findOne({ 
                            where:{doctorId: data.doctorId},
                            raw: false
                        })
                        if(doctorMarkDown){
                            doctorMarkDown.contentHTML=data.contentHTML,
                            doctorMarkDown.contentMarkdown=data.contentMarkdown,
                            doctorMarkDown.description= data.description,
                            await doctorMarkDown.save()
                        }
                    }
                    let doctorInfor = await db.Doctor_Infor.findOne({
                        where:{
                            doctorId:data.doctorId,
                        },
                        raw:false
                    })
                    if(doctorInfor){
                        doctorInfor.doctorId = data.doctorId,
                        doctorInfor.priceId=data.SelectedPrice,
                        doctorInfor.provinceId=data.SelectedProvince,
                        doctorInfor.paymentId= data.SelectedPayment,
                        doctorInfor.addressClinic=data.addressClinic,
                        doctorInfor.nameClinic=data.nameClinic,
                        doctorInfor.note= data.note,
                        doctorInfor.specialtyId = data.specialtyId,
                        doctorInfor.clinicId= data.clinicId,
                        await doctorInfor.save()

                       
                    }else{
                        await db.Doctor_Infor.create({
                       doctorId : data.doctorId,
                            priceId:data.SelectedPrice,
                            provinceId:data.SelectedProvince,
                            paymentId: data.SelectedPayment,
                            addressClinic:data.addressClinic,
                            nameClinic:data.nameClinic,
                            note: data.note,
                            specialtyId: data.specialtyId,
                            clinicId: data.clinicId

                        })
                    }
                    resolve({
                        errCode:0,
                        errMessage:'Save info Doctor success'
                    })
                }
            }catch(e){
                reject(e);
            }
        })
    }
    getDetailDoctorsById(userId) {
        return new Promise(async (resolve, reject) =>{
            try{
                if(!userId){
                    resolve({
                        errCode:1,
                        errMessage:'Missing params hi'
                    })
                }else{
                    let data = await db.User.findOne({
                        where:{
                            id:userId
                        },
                        attributes:{
                            exclude:['password']
                        },
                        include:[
                            {
                                model:db.Markdown,
                                attributes: ['description','contentHTML','contentMarkdown']
                            
                            },
                            {
                                model:db.Doctor_Infor,
                                attributes:{
                                    exclude: ['id','doctorId']},
                                    include: [
                                        {
                                            model:db.Allcode, as: 'priceData', attributes: ['valueVi','valueEn'],
                                            },
                                            {
                                            model:db.Allcode, as: 'provinceData', attributes: ['valueVi','valueEn'],
                                             },
                                            {
                                             model:db.Allcode, as: 'paymentData', attributes: ['valueVi','valueEn'],
                                             }
                                
                                

                                    ],},
                            {model:db.Allcode,as:'positionData', attributes:['valueEn','valueVi'],},
                        ],

                            
                          

    
                        
                        raw:false,
                        nest: true
                    })
                 if(data && data.image){
                    data.image = Buffer.from(data.image,'base64').toString('binary');
                 }
                 if(!data){
                     data:{};
                 }
                    resolve({
                        errCode:0,
                        data:data
                    })
                }
                   
            
            }catch(e){
                reject(e);
            }
        })
    }
    bulkCreateSchedule (data){
        return new Promise(async (resolve, reject) =>{
            try {
                if(!data.arrSchedule || !data.doctorId || !data.fomatedDate){
                    resolve({
                        errCode:1,
                        errMessage:"Mising require arrSchedule"
                    })
                }else{
                let schedule = data.arrSchedule

                if(schedule && schedule.length > 0){
                    schedule = schedule.map(item=>{
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item 
                    })
                }
                console.log('schedule',typeof schedule)

                    let existing = await db.Schedule.findAll({
                        where:{doctorId:data.doctorId,date:data.fomatedDate,},
                        attributes: ['timeType','date','doctorId','maxNumber']

                    })

                    // if(existing && existing.length > 0){
                    //     existing = existing.map(item =>{
                    //         item.date = new Date(item.date).getTime()
                    //         return item
                    //     })
                    // }
                    
                    let toCreat = _.differenceWith(schedule,existing, (a,b)=>{
                        return a.timeType === b.timeType && +a.date === +b.date
                    })
                    console.log('check toCreat',toCreat )
                    if(toCreat && toCreat.length > 0){
                        await db.Schedule.bulkCreate(toCreat);

                    }
                    resolve({
                        errCode:0,
                        errMessage:'ok'
                    })
                    console.log('check data gui ',data)
                    console.log('check data gui ', typeof data)
                }

            }catch(e){
                reject(e);
            }
        })
    }
    getScheduleByDateService(doctorId,date){
        return new Promise(async (resolve, reject) =>{
            try{
                if(!doctorId || !date){
                    resolve({
                        errCode:1,
                        errMessage:" Missing required parameters"
                    })
                }else{
                    let data = await db.Schedule.findAll({
                        where:{
                            doctorId: doctorId,
                            date: date
                        },
                        include:[
                           
                        {model:db.Allcode,as:'timeTypeData', attributes:['valueEn','valueVi'],},
                        {model:db.User,as:'doctorData', attributes:['firstName','lastName'],},

    
                        ],
                        raw:false,
                        nest: true
                    })
                    if(!data){
                        data=['no']
                    }
                    resolve({
                        errCode:0,
                        data:data
                    })
                }
            }catch(e){
                reject(e)
            }
        })
    }
    getExtraInforDoctorByIdService(id){
        return new Promise(async (resolve, reject) =>{
            try{
                if(!id){
                    resolve({
                        errCode:1,
                        errMessage:"Mising require arrSchedule"
                    })

                }else{
                    let data = await db.Doctor_Infor.findOne({
                        where: {
                            doctorId: id
                        },
                        attributes:{
                            exclude: ['id','doctorId']
                        },
                        include:[
                            {
                                model:db.Allcode, as: 'priceData', attributes: ['valueVi','valueEn'],
                                },
                                {
                                model:db.Allcode, as: 'provinceData', attributes: ['valueVi','valueEn'],
                                 },
                                {
                                 model:db.Allcode, as: 'paymentData', attributes: ['valueVi','valueEn'],
                                 }
                        ],
                        raw:true,
                        nest: true
                    })

                    if(!data){
                        data = []
                    }
                    resolve({
                        errCode:0,
                        data:data
                    })
                }
            }catch(e){
                reject(e)
            }
        }) 
        }
        getProfileDoctorByIdService(id){
            return new Promise(async(resolve,reject) =>{
                try {
                    if(!id){
                        resolve({
                            errCode:1,
                            errMessage:"Mising require arrSchedule"
                        })
    
                    }else{
                        let data = await db.User.findOne({
                            where:{
                                id:id
                            },
                            attributes:{
                                exclude:['password']
                            },
                            include:[
                                {
                                    model:db.Markdown,
                                    attributes: ['description','contentHTML','contentMarkdown']
                                
                                },
                                {
                                    model:db.Doctor_Infor,
                                    attributes:{
                                        exclude: ['id','doctorId']},
                                        include: [
                                            {
                                                model:db.Allcode, as: 'priceData', attributes: ['valueVi','valueEn'],
                                                },
                                                {
                                                model:db.Allcode, as: 'provinceData', attributes: ['valueVi','valueEn'],
                                                 },
                                                {
                                                 model:db.Allcode, as: 'paymentData', attributes: ['valueVi','valueEn'],
                                                 }
                                    
                                    
    
                                        ],},
                                {model:db.Allcode,as:'positionData', attributes:['valueEn','valueVi'],},
                            ],
    
                                
                              
    
        
                            
                            raw:false,
                            nest: true
                        })
                     if(data && data.image){
                        data.image = Buffer.from(data.image,'base64').toString('binary');
                     }
                     if(!data){
                         data:{};
                     }
                        resolve({
                            errCode:0,
                            data:data
                        })
            
                       
            }
                
                }catch(e){
                    reject(e)
                }
            })
        }
        getListPatientForDoctorService(doctorId,date){
            return new Promise(async (resolve, reject) =>{
                try{
                    if(!doctorId || !date){
                        resolve({
                            errCode:1,
                            errMessage:"Mising require arrSchedule"
                        })
    
                    }else{
                        let data = await db.Booking.findAll({
                            where: {
                                statusId: 'S2',
                                doctorId: doctorId,
                                date: date
                            }
                            ,
                            include:[
                                {
                                    model:db.User,as:'patientData',attributes: ['email','firstName','address','gender'],
                                    
                                        include:[
                                            
                                            {
                                                model: db.Allcode, as:'genderData',
                                                attributes: ['valueVi','valueEn']}
                                        ]
                                
                                    },
                                   
                                
                                {
                                    model:db.Allcode,
                                    as:'timeTypeDataBooking',
                                    attributes: ['valueVi','valueEn']
                                
                                }
                            ],
                                
                                raw:false,
                                  nest: true
                            }
                        )
                        resolve({
                            errCode:0,
                            data:data
                        })
                    }
                }catch(e){
                    reject(e)
                }
            })
        }
        sendRemedyService(data){
            return new Promise(async (resolve, reject) =>{
                try{
                    if(!data.email || !data.doctorId || !data.patientId || !data.timeType){
                        resolve({
                            errCode:1,
                            errMessage:"Mising require arrSchedule"
                        })
    
                    }else{
                        // update patient status
                        let appointment = await db.Booking.findOne({
                            where: {
                                doctorId: data.doctorId,
                                patientId: data.patientId,
                                timeType: data.timeType,
                                statusId: 'S2'
                            },
                            raw: false
                        })
                        if(appointment){
                            appointment.statusId = 'S3'
                            await appointment.save()
                        }

                        // send email
                        await emailService.sendAttachMent(data)
                        resolve({
                            errCode:0,
                            errMessage:'ok'
                        })
                    }

                }catch(e){
                    reject(e)
                }
            })
        }
}
module.exports = new doctorService