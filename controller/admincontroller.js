const admin = require('../model/admin');
const path = require('path');
const fs = require('fs');

module.exports.admin_register = async(req, res)=>{
    try {
        let checkEmail = await admin.findOne({ email: req.body.email });
        if (checkEmail) {
            return res.status(400).json({ mes: 'Email is Already Exist', status: 0 });
        }
        else {
            let cpass = req.body.confirm_pass;
            if (cpass == req.body.password) {
                var imagePath = '';
                if (req.file) {
                    imagePath = admin.imagePath + "/" + req.file.filename
                }
                req.body.image = imagePath;
                req.body.IsActive = true;
                req.body.Create_Date = new Date().toLocaleString();
                req.body.Update_Date = new Date().toLocaleString();
                let ReData = await admin.create(req.body);
                if (ReData) {
                    return res.status(200).json({ mes: 'Record is Insert', status: 1 });
                }
                else {
                    return res.status(200).json({ mes: 'Record is Not Insert', status: 0 });
                }
            }
            else {
                return res.status(200).json({ mes: 'Confirm password is not match', status: 0 });
            }

        }
    } catch (error) {
        console.log(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mes: error.message, status: 0 });
        } else {
            return res.status(500).json({ mes: 'Internal Server Error', status: 0 });
        }
    }
}
module.exports.view_profile = async(req,res)=>{
    try {
        let search = '';
        
        

        if (req.query.search) {
            search = req.query.search
        }
        // console.log(req.query.search);
        if (req.query.page) {
            page = req.query.page;
        }
        else {
            page = 0
        }
        var perpage = 2;

        let admindata = await admin.find({
            $or: [
                { "name": { $regex: ".*" + search + ".*", $options: "i" } },
                { "email": { $regex: ".*" + search + ".*", $options: "i" } },
                { "Mobile_Number": { $regex: ".*" + search + ".*", $options: "i" } }
            ]
        })
            .limit(perpage)
            .skip(perpage * page);
        if(admindata){
            return res.status(200).json({ mes: 'view admin by search ', status: 1, ad: admindata });
        }   
           

        let AdminePage = await admin.find({
            $or: [
                { "name": { $regex: ".*" + search + ".*", $options: "i" } },
                { "email": { $regex: ".*" + search + ".*", $options: "i" } },
                { "Mobile_Number": { $regex: ".*" + search + ".*", $options: "i" } }
            ]
        }).countDocuments();
        

        if(AdminePage){
            return res.status(200).json({ mes: 'view admin by pagination data', status: 1, ad: AdminePage });
        }
        

        let adminrecord = await admin.find({});
        if(adminrecord){
            return res.status(200).json({ mes: 'view admin data', status: 1, ad: adminrecord });
        }
        else{
            return res.status(200).json({ mes: 'admin data is not found', status: 0});
        }
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mes: 'data view is Not Found', status: 0 });
    }
}

module.exports.edit_admin = async(req,res)=>{
    try {
        
        if (req.file) {
            let oldImg = await admin.findById(req.params.id);
            // console.log(oldImg);
            if (oldImg.image) {
                let fullPath = path.join(__dirname, "..", oldImg.image);
                // console.log(fullPath);
                await fs.unlinkSync(fullPath);
            }
            var imgPath = '';
            imgPath = admin.imagePath + "/" + req.file.filename;
            req.body.image = imgPath;
        }
        else {
            let olddata = await admin.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.image;
            }
            req.body.image = imgpath;
        }
        req.body.Update_Date = new Date().toLocaleString();
        let adminupdated = await admin.findByIdAndUpdate(req.params.id, req.body);
        if (adminupdated) {
            let updateprofile = await admin.find({})
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: updateprofile });
        }
        else {
            return res.status(400).json({ msg: 'not Updated Succ..', status: 0 });
        }
    } catch (error) {
        console.log(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mes: error.message, status: 0 });
        } else {
            return res.status(500).json({ mes: 'Internal Server Error', status: 0 });
        }
    }
}

module.exports.delte_admin = async(req,res)=>{
    try {
        let oldData = await admin.findById(req.params.id);
        if (oldData) {
            var oldImage = oldData.Admineimage;
            if (oldImage) {
                let FullPath = path.join(__dirname, "..", oldData.Admineimage);
                await fs.unlinkSync(FullPath);
                let DeleteRecord = await admin.findByIdAndDelete(req.params.id);
                if (DeleteRecord) {
                    return res.status(200).json({ msg: 'Record and Image Delete Succesfully', status: 1, rec: DeleteRecord });
                }
                else {
                    return res.status(200).json({ msg: 'Record Delete Succesfully', status: 1 });
                }
            }
            else {
                let deletPostData = await admin.findByIdAndDelete(req.params.id);
                if (deletPostData) {
                    return res.status(200).json({ msg: 'Admin Data Delete', status: 1, rec: deletPostData });
                }
                else { 
                    return res.status(200).json({ msg: 'Admin Data not Delete', status: 1});
                }
            }
        }
        else {
            return res.status(200).json({ msg: 'Admin Data not Delete', status: 1, rec: deletPostData });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mes: 'data delete by put time error', status: 0 });
    }
}

module.exports.multepleselce = async (req, res) => {
    try {
        // console.log(req.body);
        let deleteRec = await admin.deleteMany(req.query);
        return res.status(200).json({ msg: 'Admin Data Delete', status: 1, rec: deleteRec });


    } catch (error) {
        console.log("multiple admin delete time eroor", error);
        return res.redirect('back')
    }
}