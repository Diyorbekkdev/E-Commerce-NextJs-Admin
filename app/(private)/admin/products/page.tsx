'use client'
import Loading from '@/components/loading';
import { request } from '@/server/request';
import { Button, Descriptions, Form, Input, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import {FolderAddOutlined} from '@ant-design/icons';


import remove from '@/public/delete.png';
import edit from '@/public/edit.png';
import Image from 'next/image';

import './styleCard.css';
import TextArea from 'antd/es/input/TextArea';

interface Products {
  _id: string;
  title: string,
  price: number,
  description: string,
  image: {
    url: string
  },
  quantity: number,
  category: string
}




const Products: React.FC = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState(null);
  const [form] = Form.useForm();
  
  
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const mainShowModal = () => {
    form.resetFields()
    setIsModalVisible(true)
    setSelected(null)
  }
  async function getData() {
    try {
      setLoading(true);
      const response = await request.get("product");
      let data: Products[] = response.data.products
      setProducts(data); 
      setLoading(false)
    } catch (err) {
      console.error(err);
      return [];
    }
    
  }
  useEffect(() => {
      getData();
    }, []);

  const handleOk = () => {
    form.validateFields().then((values: Products) => {
      
      const {  image, title, price, description, quantity,category } = values;
        console.log(values);
        
      const requestData = {
        title: title,
        price: price,
        description: description,
        quantity: quantity,
        category: category,
        image: {
          url: image,
        },
      };
      
      if (selected) {
        
        request
          .put(`product/${selected}`, requestData)
          .then(() => {
            setIsModalVisible(false);
            getData();
            message.success("Successfully changed");
          })
          .catch((err) => {
            message.error(err.response ? err.response.data.msg : "Timeout");
          });
      } else {
        request
          .post("product", requestData)
          .then(() => {
            setIsModalVisible(false);
            getData();
            setLoading(false)
          })
          .catch((err) => {
            message.error(err.response ? err.response.data.msg : "Timeout error ");
          });
      }
    });
  };


  const deleteProduct= async (id: string) => {
    try {
      
      setLoading(true)
      await request.delete(`product/${id}`);  
      getData();
      setLoading(false)
      message.success("Successfully deleted");
    } catch (err: any) {
      message.error(err.response ? err.response.data.msg : "Timeout");
    }
  };
  async function editProduct(id: any) {
    setSelected(id);
    try {
      const { data } = await request.get(`product/${id}`);
      form.setFieldsValue(data);
      showModal();
    } catch (err: any) {
      message.error(err.response ? err.response.data.msg : "Timeout error");
    }
  }
  console.log(selected);
  
  const showDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this category?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteProduct(id);
      },
    });
  };
console.log(products);


  return (
    <div>
      <div className="category__header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', boxShadow: '0px 5px 5px -5px rgba(34, 60, 80, 0.6)', padding: '10px', borderRadius: '10px', border: '1px solid #bbb'}}>
        <h1>All Products</h1>
        <Button type='primary' icon={<FolderAddOutlined />} size='large' style={{boxShadow: '0px 5px 5px -5px rgba(34, 60, 80, 0.6)'}} onClick={mainShowModal}>Add Product</Button>
      </div>
      {loading ? <div><Loading/></div> : <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', rowGap: '30px', placeItems: 'center'}}>
        {products?.map((res) => (
          <div className="card" key={res._id} >
          <div className="card-img" style={{background: `url(${res?.image?.url}) center center`, backgroundSize: 'cover'}} >
  
          </div>
          <div className="card-info">
            <p className="text-title">{res.title}</p>
            <p>{res.description}</p>
          </div>
          <div className="card-footer">
          <span className="text-title"></span>
          <div style={{display: 'flex', gap: '10px'}}>
            <div className="card-button" >
              <Image src={remove} alt="delete" onClick={()=> deleteProduct(res._id)} />
            </div>
            <div className="card-button" >
              <Image src={edit} alt="delete" onClick={()=> editProduct(res._id)} />
            </div>
          </div>
        </div>
        </div>
        ))}
       </div> }

       <Modal
         title="Create New Category"
         open={isModalVisible} 
         onCancel={handleCancel}
         footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            form="editCategoryForm"
            htmlType="submit"
          >
            {selected ? 'Save Changes' : 'Add Product'}
          </Button>,
        ]}>

          <Form name="editCategoryForm" 
             labelCol={{ span: 24 }}
             wrapperCol={{ span: 24 }}
             form={form}
          >
          <Form.Item name="category" label="Product Category" rules={[{ required: true, message: 'Please enter product title' }]}>
            <Input placeholder='Product Category' />
          </Form.Item>
          <Form.Item name="title" label="Product title" rules={[{ required: true, message: 'Please enter product title' }]}>
            <Input placeholder='Product name' />
          </Form.Item>
          <Form.Item name="description" label="Product description" rules={[{ required: true, message: 'Please enter product description' }]}>
          <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="price" label="Product description" rules={[{ required: true, message: 'Please enter product price' }]}>
            <Input type='number' placeholder='Product Price' />
          </Form.Item>
          <Form.Item name="quantity" label="Product quantity" rules={[{ required: true, message: 'Please enter product price' }]}>
            <Input type='number' placeholder='Product quantity' />
          </Form.Item>
          {/* <Form.Item name="image" label="Product Image" rules={[{  message: 'Please provide product image' }]}>
            <Input  placeholder='https://image.url'/>
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
};

export default Products;

