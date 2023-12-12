import db from '../models/index';
import patientService from '../services/patientService';



class patientController  {
    async postBookAppointment(req, res, next){
        try{
            let infor = await patientService.postBookAppointmentService(req.body)
            if(infor){
                return res.status(200).json(infor)
            }else{
                return res.status(200).json({
                    errCode:1,
                    errMessage:'Error from sever else'
                })
            }
        }catch(e){
            console.log('eeeee',e)
            return res.status(200).json({
                errCode:-1,
                errMessage:'Error from sever'
            })
        }
    }
    async postVerifyBookAppointment(req, res, next){
        try{
            let infor = await patientService.postVerifyBookAppointmentService(req.body)
            if(infor){
                return res.status(200).json(infor)
            }else{
                return res.status(200).json({
                    errCode:1,
                    errMessage:'Error from sever else'
                })
            }
        }catch(e){
            console.log('eeeee',e)
            return res.status(200).json({
                errCode:-1,
                errMessage:'Error from sever'
            })
        }
    }
  
}


module.exports = new patientController