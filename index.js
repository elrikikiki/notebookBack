const fs = require('fs').promises

class ProductManager {
    idAuto = 1;
    #products;
    path= ``;

    constructor(){
        this.#products = [];
        this.path = `./prod.json`
    }

    async getProducts()
    {
        try{
            const productFile = await fs.readFile(this.path, "utf-8" ) /* ahi va a leer la ruta "this.path" pero le pasas un utf-8 para decodificar esa ruta */
            return JSON.parse(productFile)
        }
        catch(e){
            await fs.writeFile(this.path, '[]')
            return 'No existe el archivo, ya se creó un array vacio'
        }
    }
    async addProduct(product){
        try{
            const productFile = await fs.readFile(this.path, 'utf-8')
            let newProduct = JSON.parse(productFile)
            const valid = newProduct.find(
                p => p.id === product.id || p.code === product.code
            );

            if(valid) {
                throw new Error('No pibe, tenes el id o el code igual')
            }

            if(newProduct.length > 0){
                const lastProduct = newProduct[newProduct.length - 1]
                this.idAuto = lastProduct.id + 1;
            }

            newProduct.push({
                ...product, id: this.idAuto++
            })

            await fs.writeFile(this.path, JSON.stringify(newProduct))
        }
        catch (e) {
            throw new Error(e)
        }

       
    }
    async getProductById(id){
        try{
            const productFile = await fs.readFile(this.path, 'utf-8')
            let idProduct = JSON.parse(productFile)
            const searchProd = idProduct.find(
                (p) => p.id === id
            )
            if(!searchProd) {
                throw new Error('No encontre ese producto')
            }
            return searchProd;
        }
        catch(e){
            throw new Error(e)
        }
    }

     async updateProduct(id, product) {
        try{
            const productFile = await fs.readFile(this.path, 'utf-8')
        let products = JSON.parse(productFile)
        const idProduct = products.findIndex((p)=> p.id=== id)

        products.splice(idProduct,1,{id, ...product});

        await fs.writeFile(this.path, JSON.stringify(products))
        }
        catch(e){
            throw new Error(e)
        }
     }

     async deleteProduct(id) {
        const productFile = await fs.readFile(this.path, 'utf-8')
        let products = JSON.parse(productFile)
        const  idProd = products.find((p)=> p.id === id)
        if(!idProd)
        {
            throw new Error('ese id no existe')
        }
        const deletedProduct = products.filter((prod)=> prod.id !== id)
        await fs.writeFile(this.path, JSON.stringify(deletedProduct))
     }
}
const productManager1 = new ProductManager()

let product = {
    title:'prod prueba',
    description: 'texto prueba',
    thumbnail:'img prueba',
    code:'abc123'
}

const main = async () => {
    await productManager1.addProduct({...product, code:'aasffjkgn'})
    await productManager1.updateProduct(5,{...product, code:'MODIFICADO', title: 'prod sin prueba'}) 
    /* await productManager1.deleteProduct(5) */
    await productManager1.getProducts()
    /* await productManager1.getProductById(7)   */ 
}
main()