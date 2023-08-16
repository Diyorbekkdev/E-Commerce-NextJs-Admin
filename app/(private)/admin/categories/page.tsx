'use client'
import CategoryCard from '@/components/card/CategoryCard';
import Loading from '@/components/loading';
import { request } from '@/server/request';
import { Button, Form, Input, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import {FolderAddOutlined} from '@ant-design/icons';


import remove from '@/public/delete.png';
import edit from '@/public/edit.png';
import Image from 'next/image';

import './stylecategoryCard.css';
import { CategoryTypes } from '@/types';

interface Category {
  _id: string; 
  name: string;
  image: {
    url: string;
  };
  
}



const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
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

  async function getData() {
    try {
      setLoading(true);
      const response = await request("category");
      return response.data; 
      
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  const handleOk = () => {
    form.validateFields().then((values: CategoryTypes) => {
      
      const { name, image } = values;

      const requestData = {
        name: name,
        image: {
          url: image,
        },
      };
      
      if (selected) {
        request
          .put(`category/${selected}`, requestData)
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
          .post("category", requestData)
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
  
  useEffect(() => {
    async function fetchCategories() {
      const categoriesData = await getData();
      setLoading(false);
      setCategories(categoriesData);
    }

    fetchCategories();
  }, []);

  const deleteCategory = async (id: string) => {
    try {
      setLoading(true)
      await request.delete(`category/${id}`);  
      getData();
      setLoading(false)
      message.success("Successfully deleted");
    } catch (err: any) {
      message.error(err.response ? err.response.data.msg : "Timeout");
    }
  };
  async function editCategory(id: any) {
    setSelected(id);
    try {
      const { data } = await request.get(`category/${id}`);
      form.setFieldsValue(data);
      showModal();
    } catch (err: any) {
      message.error(err.response ? err.response.data.msg : "Timeout error");
    }
  }
  const showDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this category?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteCategory(id);
      },
    });
  };

  return (
    <div>
      <div className="category__header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', boxShadow: '0px 5px 5px -5px rgba(34, 60, 80, 0.6)', padding: '10px', borderRadius: '10px', border: '1px solid #bbb'}}>
        <h1>Categories</h1>
        <Button type='primary' icon={<FolderAddOutlined />} size='large' style={{boxShadow: '0px 5px 5px -5px rgba(34, 60, 80, 0.6)'}} onClick={showModal}>Add Category</Button>
      </div>
      {loading ? <div><Loading/></div> : <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', rowGap: '30px', placeItems: 'center'}}>
        {categories.map((res) => (
          <div className="card" key={res._id} >
          <div className="card-img" style={{background: `url(${res?.image?.url}) center center`, backgroundSize: 'cover'}} >
          </div>
          <div className="card-info">
            <p className="text-title">{res.name}</p>
            <p>Category Name</p>
          </div>
          <div className="card-footer">
          <span className="text-title"></span>
          <div style={{display: 'flex', gap: '10px'}}>
            <div className="card-button" onClick={() => showDeleteConfirm(res._id)}>
              <Image src={remove} alt="delete"  />
            </div>
            <div className="card-button" onClick={() => editCategory(res._id)}>
              <Image src={edit} alt="delete" />
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
            {selected ? 'Save Changes' : 'Add Category'}
          </Button>,
        ]}>

          <Form name="editCategoryForm" 
             labelCol={{ span: 24 }}
             wrapperCol={{ span: 24 }}
             form={form}
          >
          <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Please enter category name' }]}>
            <Input placeholder='Category name' />
          </Form.Item>
          <Form.Item name="image" label="Category Image" rules={[{ required: true, message: 'Please provide category image' }]}>
            <Input  placeholder='https://image.url'/>
          </Form.Item>
          
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
