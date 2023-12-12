import db from '../models/index';
import specialtyService from '../services/specialtyService';


class specialtyController  {
    async creteSpecialty (req, res, next){
        try{
            let infor = await specialtyService.createSecialtyService(req.body)
           
            return res.status(200).json(infor)
            
        }catch(e){
            console.log(e);
            return res.status(200).json({
                errCode:-1,
                errMessange:'Error from the server'
            })
        }
    }
    async getAllSpecialty (req, res, next){
        try{
            let infor = await specialtyService.getAllSpecialtyService()
           
            return res.status(200).json(infor)
            
        }catch(e){
            console.log(e);
            return res.status(200).json({
                errCode:-1,
                errMessange:'Error from the server'
            })
        }
    }
   async getDetailSpecialtyById(req, res, next){
        try{
            let infor = await specialtyService.getDetailSpecialtyByIdService(req.query.id,req.query.location)
           
            return res.status(200).json(infor)
            
        }catch(e){
            console.log(e);
            return res.status(200).json({
                errCode:-1,
                errMessange:'Error from the server'
            })
        }
    }

}


module.exports = new specialtyController