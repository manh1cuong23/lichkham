import db from '../models/index';
import CRUDService from '../services/CRUDService';


class homeController  {
     async getHomePage  (req, res, next){
        try{
            let data = await db.User.findAll()    ;
            res.render('homepage',{
                data:JSON.stringify(data)
            })

        }catch(e){
            console.log(e)
        }

    
    }
     getAboutPage (req, res, next){
        res.render('test/about')
    }
    getCRUD(req, res, next){
        res.render('test/crud')
    }
    async postCRUD(req, res, next){
       let message =  await CRUDService.createNewUser(req.body)
       console.log(message) 
       res.redirect('get-crud')

    }
   async displayCRUD(req, res, next){
        let data = await CRUDService.getAllUser();
       
        return res.render('displayCRUD.ejs',{
            dataTable: data
        })
    }
    async editCRUD(req, res, next){
        let userId = req.query.id;

        if(userId){
            let userData = await CRUDService.getUserByUserId(userId);
            console.log('userData',userData)
            res.render('editCRUD',{
                user:userData
            })
        }else{
            console.log(req.query.id)

            res.send('no id result found')
        }
    }
    async putCRUD(req, res, next){
        let data= req.body;
        await CRUDService.updateCRUD(data)
        res.redirect('get-crud')
    }
    async deleteCRUD(req, res, next){
        let id = req.query.id
        if(id){
            await CRUDService.deleteCRUD(id);
            res.redirect('get-crud')

        }else{
            res.send('id not found')
        }
    }

}


module.exports = new homeController