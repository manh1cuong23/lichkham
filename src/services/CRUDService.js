import bcrypt from 'bcryptjs';
import db from '../models/index'
const salt = bcrypt.genSaltSync(10);
function hashUserPassword  (password){
    return new Promise(async (resolve, reject)=>{
        try{
             let hashPassword = await bcrypt.hashSync(password, salt);
             resolve(hashPassword)

        }catch(e){
            reject(e);
        }

    })
}
class CRUDService {
   

    async createNewUser  (data){
        return new Promise(async (resolve, reject) =>{
            try{
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
    
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber:data.phoneNumber,
                    gender:data.gender === '1' ? true : false,
                    roleId: data.roleId,
                })
                resolve('okiii')
            }catch(e){
                reject(e);
            }
        })
        
        console.log('data',data)
        console.log('password',hashPasswordFromBcrypt)
    
    }
    
     getAllUser () {
        return new Promise(async (resolve, reject) =>{
            try{
                let users = db.User.findAll({
                    raw:true
                });
                resolve(users)
            } catch(e){
                reject(e);
            }   
        })
    }
    getUserByUserId(id){
        return new Promise(async(resolve, reject)=>{
            try{
                let user =await db.User.findOne({
                    where: {
                        id:id,
                    },raw:true
                })
                if(user){
                    resolve(user)
                }else{
                    resolve([])
                }
            }catch(e){
                reject(e);
            }
        })

    }
    updateCRUD(data){
        return new Promise(async (resolve, reject) =>{
            try{
                let user = await db.User.findOne({where:{id:data.id},
                raw:false})

                if(user){
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.address = data.address; 

                     await user.save()
                    resolve()

                }else{
                    resolve()
                }

            }catch(e){
                reject(e)
            }
        })
        console.log('data',data)
    }
    deleteCRUD(id){
        return new Promise(async (resolve, reject) =>{
            try{
                let user = await db.User.findOne({
                    where:{id:id}
                })
                if(user){
                    await db.User.destroy({
                        where:{id:id}
                    })
                }
                resolve()
            }catch(e){
                reject(e)
            }
        })
    }
}
module.exports = new CRUDService