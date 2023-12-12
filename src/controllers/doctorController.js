import db from '../models/index';
import doctorService from '../services/doctorService';


class doctorController  {
  async  getTopDoctorHome(req, res, next){
        let limit =req.query.limit
        if(!limit){
            limit =10;
        }
        try{
            let response = await doctorService.getTopDoctorHome(+limit)
            return res.status(200).json(response);
        }catch(e){
            console.log('eeeee',e)
            return res.status(200).json({
                errCode:-1,
                message:'Error from sever'
            })
        }
    }
    async getAllDoctors(req, res, next){
        try{
            let doctors = await doctorService.getAllDoctor();
            console.log('eeeee',doctors)

            return res.status(200).json(doctors)
        }catch(e){
            console.log('eeeee',e)
            return res.status(200).json({
                errCode:-1,
                errMessage:'Error from sever'
            })
        }
    }
    async postInforDoctors(req, res, next){
        try{
            console.log('reqqqqq ',req)
            let response = await doctorService.saveDetailInforDoctor(req.body)

            return res.status(200).json(response)
        }catch(e){
            console.log('eeeee',e)
            return res.status(200).json({
                errCode:-1,
                errMessage:'Error from sever'
            })
        }
    }
    async getDetailDoctorsById(req, res, next){
        try{
            console.log('check id ',req.query.id)
            let infor = await doctorService.getDetailDoctorsById(req.query.id)
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
    async bulkCreateSchedule(req, res, next){
        try{
            let infor = await doctorService.bulkCreateSchedule(req.body)
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
    async getScheduleDoctorsByDate(req, res, next){
        try{
            console.log('cuong checl date nhe ',req.query)
            let infor = await doctorService.getScheduleByDateService(req.query.doctorId,req.query.date);
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
    async getExtraInforDoctorById(req, res, next){
        try{
            console.log('cuong checl date nhe ',req.query)
            let infor = await doctorService.getExtraInforDoctorByIdService(req.query.doctorId);
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
   async geProfileDoctorById(req, res, next){
        try{
            console.log('cuong checl date nhe ',req.query)
            let infor = await doctorService.getProfileDoctorByIdService(req.query.doctorId);
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
    async getListPatientForDoctor(req, res, next){
        try{
            console.log('cuong checl date nhe ',req.query)
            let infor = await doctorService.getListPatientForDoctorService(req.query.doctorId,req.query.date);
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
    async sendRemedy(req, res, next){
        try{
            console.log('cuong checl date nhe ',req.query)
            let infor = await doctorService.sendRemedyService(req.body);
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


module.exports = new doctorController