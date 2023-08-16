"use client";

import { useEffect, useState } from "react";
import { QuestionCircleOutlined,DeleteOutlined,EditOutlined, UserAddOutlined } from '@ant-design/icons';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";

import { User } from "@/types";
import { request } from "@/server/request";
import Loading from "@/components/loading";

export default function UsersP() {
  const [users, setUsers] = useState([] as User[]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([] as React.Key[]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns: ColumnsType<User> = [
    {
      title: "FirstName",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "LastName",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "PhoneNumber",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Actions",
      render: (user) => (
        <Button loading={loading} icon={<EditOutlined />} onClick={() => editUser(user._id)} type="primary">
          Edit
        </Button>
      ),
    },
  ];

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      setLoading(true);
      let res = await request.get("user");

      let data: User[] = res.data;

      data = data.map((user) => {
        user.key = user._id;
        return user;
      });
      setUsers(data);
    } catch (err: any) {
      message.error(err.response ? err.response.data.msg : "Timeout");
    } finally {
      setLoading(false);
    }
  }

  const openUserModal = () => {
    showModal();
    setSelected(null);
    form.resetFields();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values: User) => {
      if (selected) {
        if (!values.password) {
          delete values.password;
        }
        request
          .put(`user/${selected}`, values)
          .then(() => {
            setIsModalOpen(false);
            getUsers();
            message.success("Successfully changed");
          })
          .catch((err) => {
            message.error(err.response ? err.response.data.msg : "Timeout");
          });
      } else {
        request
          .post("user", values)
          .then(() => {
            setIsModalOpen(false);
            getUsers();
          })
          .catch((err) => {
            message.error(err.response ? err.response.data.msg : "Timeout");
          });
      }
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  async function editUser(id: string) {
    setSelected(id);
    try {
      const { data } = await request.get(`user/${id}`);
      form.setFieldsValue(data);
      showModal();
    } catch (err: any) {
      message.error(err.response ? err.response.data.msg : "Timeout");
    }
  }

  function getSelected(selectedRowKeys: React.Key[]) {
    setSelectedUsers(selectedRowKeys);
  }

  const deleteUsers = async () => {
    try {
      const deletePromises = selectedUsers.map((key) =>
        request.delete(`user/${key}`)
      );
      await Promise.all(deletePromises);
      getUsers();
      message.success("Deleted successfully!");
    } catch (err: any) {
      message.error(err.response ? err.response.data.msg : "Timeout");
    }
  };


  return (
    <main className="">
      {users.length !== 0 ? (
        <Table
          title={() => (
            <div
            style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', boxShadow: '0px 5px 5px -5px rgba(34, 60, 80, 0.6)', padding: '8px', borderRadius: '10px', border: '1px solid #bbb'}}
            >
              <h1>All users</h1>
              {selectedUsers.length !== 0 ? (
                 <Popconfirm
                 title="Delete the task"
                 description="Are you sure to delete this task?"
                 icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                 onConfirm={deleteUsers} 
               >
                 <Button danger icon={<DeleteOutlined />}>Delete</Button>
               </Popconfirm>
              ) : null}
              <Button onClick={openUserModal} size="large" type="primary" icon={<UserAddOutlined />}>Add User</Button>
            </div>
          )}
          loading={loading}
          dataSource={users}
          columns={columns}
          rowSelection={{
            onChange: getSelected,
          }}
        />
      ) : (
        <div className="w-full h-[100%] flex items-center justify-center "><Loading/></div>
      )}
      <Modal
        title={`${selected ? 'Edit User' : 'Create User'}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="user"
          form={form}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 500 }}
          initialValues={{ phoneNumber: "+998" }}
          autoComplete="off"
        >
          <Form.Item<User>
            label="FirstName"
            name="firstName"
            rules={[{ required: true, message: "Please fill this field!" }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item<User>
            label="LastName"
            name="lastName"
            rules={[{ required: true, message: "Please fill this field!" }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>

          <Form.Item<User>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please fill this field!" }]}
          >
            <Input  placeholder="username" />
          </Form.Item>

          <Form.Item<User>
            label="PhoneNumber"
            name="phoneNumber"
            rules={[{ required: true, message: "Please fill this field!" }]}
          >
            <Input placeholder="+998 99 123 45 67" />
          </Form.Item>

          <Form.Item<User>
            label="Password"
            name="password"
            rules={[
              {
                required: selected ? false : true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
