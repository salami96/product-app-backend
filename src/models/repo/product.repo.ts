import { Product } from "../entities";
import { ProductModel, StoreModel } from "../schemas";

export class ProductRepository {
    static async saveProduct(p: Product, code: string, ownerUid: string): Promise<Product> {
        const store = await StoreModel.findOne({ $and: [ { code }, { ownerUid } ] }).exec();
        if (store) {
            const products = await ProductModel.find({ store: store.code }).exec();
            const found = products.find(product => product.cod === p.cod);
            if (found) {
                return found;
            } else {
                return await ProductModel.create(p);
            }
        }
        return null;
    }
    static async updateProduct(p: Product, code: string, ownerUid: string): Promise<Product> {
        const store = await StoreModel.findOne({ $and: [ { code }, { ownerUid } ] }).exec();
        if (store) {
            return await ProductModel.findOneAndUpdate({ $and: [ { cod: p.cod }, { store: store.code } ] }, p, { new: true }).exec();
        }
        return null;
    }
    static async deleteProduct(cod: string, code: string, ownerUid: string): Promise<Product> {
        const store = await StoreModel.findOne({ $and: [ { code }, { ownerUid } ] }).exec();
        if (store) {
            const resp = await ProductModel.findOneAndDelete({ $and: [ { cod }, { store: store.code } ] }).exec();
            return resp;
        }
        return null;
    }
    static async getProduct(cod: string, store: string): Promise<Product> {
        const product = await ProductModel.findOne({ $and: [ { cod }, { store } ] }).exec();
        return product;
    }
    static async getProducts(store: string): Promise<Product[]> {
        const product = await ProductModel.find({ store }).exec();
        return product;
    }
}
