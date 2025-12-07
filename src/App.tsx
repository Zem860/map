import { getProducts } from './api/folder_user/products';
import type { productData } from './type/product';
import { useEffect, useState } from 'react'
import {AdminHeader} from './components/Header'

function App() {
  const [produc, setProduc] = useState<productData[]>()
  useEffect(()=>{
    const params ={page:"1", category:""} 
    getProducts(params).then((res)=>{
      setProduc(res.data.products)
      console.log(res.data);
    }).catch((err)=>{
      console.log(err);
    })
   
  },[])
    
  return (
    <>
    <AdminHeader />
    {produc?.map((item)=>{
      return (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <p>Price: {item.price}</p>
          <img src={item.imageUrl} alt={item.title} width="200" />
        </div>
      )
    })}
    </>
  )
}

export default App
