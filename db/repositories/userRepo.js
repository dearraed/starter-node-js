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
        let deleted = query.deleted == "true" ? true : false;
        
        const features = new APIFeatures(
            deleted ? userModel.find({...obj, deletedAt: { $ne: null} })
                    : userModel.find({...obj, deletedAt: null}),
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
    
    static async deleteUser(user) {
        let email = user.email;
        let regex = '^old[0-9]+' + email;
        const deletedUsers = await userModel.count({ email: { $regex: regex  }  });  
        return userModel.findByIdAndUpdate(user._id, { $set: { email: `old${deletedUsers}${email}`, deletedAt: Date.now() } }, { new: true })
          .lean()
          .exec();
      }
}