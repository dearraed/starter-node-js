const userModel = require("../models/userModel");
const APIFeatures = require ('../../utils/apiFeatures')

module.exports = class UserRepo {
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

    static async findByObjPaginate(obj, options, query){
        const features = new APIFeatures(
            userModel.find({...obj, deletedAt: null }),
            query
          )
            .filter()
            .sort()
            .limitFields()
            .search(["name", "lastName", "role", "tel", "work"])


            let optionsPaginate = {
                limit: options.limit ? options.limit : null,
                page: options.page ? options.page : null,
              };
              
            const pagination = userModel.paginate(features.query, optionsPaginate);
            return await pagination;
    }
    
    static findByIdAndDelete(id){
        return userModel.findByIdAndUpdate(id, { $set : { deletedAt: Date.now() }} , { new :true } );
    }
}