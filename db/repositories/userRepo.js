const userModel = require("../models/userModel");

export default class UserRepo {
    static findOneByObjSelect(obj, select){
        return userModel.findOne(obj).select(select);
    }

    static findOneByObj(obj){
        return userModel.findOne(obj);
    }

    static create(payload){
        return userModel.create(payload);
    }

    static findById(id){
        return userModel.findById(id);
    }

    static findByIdAndUpdate(id, payload){
        return userModel.findByIdAndUpdate(id, { $set : payload } , { new :true } );
    }

    static findByObjPaginate(obj){
        return userModel.paginate(obj, options);
    }
    
    static findByIdAndDelete(id){
        return userModel.findByIdAndDelete(id);
    }
}