import db from '../models/index';



class specialtyService{
    createSecialtyService(data){
        return new Promise(async (resolve, reject) =>{
            try{
                if(!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkDown ){
                    resolve({
                        errCode:1,
                        errMessage:"Missing parammetar"
                    })
                }else{
                    await db.Specialty.create({
                        name: data.name,
                        image: data.imageBase64,
                        descriptionHTML: data.descriptionHTML,
                        descriptionMarkDown: data.descriptionMarkDown

                    })
                    resolve({
                        errCode:0,
                        errMessage:"ok"
                    })
                }

            }catch(e){
                reject(e)
            }
        })
    }
    getAllSpecialtyService(){
        return new Promise(async (resolve, reject) =>{
            try{
                let data = await db.Specialty.findAll({

                });
                if(data && data.length > 0){
                    console.log('check data o specialty',data)
                    data.map(item =>{
                        item.image = Buffer.from(item.image,'base64').toString('binary')
                        return item
                    })
                }
                resolve({
                    errCode:0,
                    errMessage:'ok',
                    data
                })
            }catch(e){
                reject(e)
            }
        })
    }
    async getDetailSpecialtyByIdService(id,location){
        return new Promise(async (resolve, reject) =>{
            try{
                if(!id || !location){
                    resolve({
                        errCode:1,
                        errMessage:"Missing required parameters"
                    })
                }else{
                    let data = {}
                    data  = await db.Specialty.findOne({
                        where:{
                            id:id
                        },
                        attributes:['descriptionHTML','descriptionMarkDown']
                    })
                    if(data){
                     let arrDoctor = []
                     let doctorSpecialty = [];
                     if(location === 'ALL'){

                         doctorSpecialty = await db.Doctor_Infor.findAll({
                            where:{
                                specialtyId:id
                            },
                           attributes:['doctorId','provinceId']
                        })
                     }else{
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where:{
                                specialtyId:id,
                                provinceId:location
                            },
                           attributes:['doctorId','provinceId']
                        }) 
                     }
                     data.doctorSpecialty = doctorSpecialty

                 }else{
                     data = {}
                 }
                    
                    resolve({
                        errCode:0,
                        errMessage:"ok",
                        data
                    })
                }
            }catch(e){
                reject(e)
            }
            
        })
    }
    
   
}
module.exports = new specialtyService