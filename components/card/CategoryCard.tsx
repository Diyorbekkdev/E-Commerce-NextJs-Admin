import React from "react";

import './categoryCard.css';
import Image from "next/image";
import remove from '../../public/delete.png';
import edit from '../../public/edit.png';
import { Form, Input, Modal } from "antd";

interface CategoryCardProps {
  _id: string;
  name: string;
  image: string;
}
const CategoryCard: React.FC<CategoryCardProps & { showModal: () => void }> = ({ _id, name, image }) => {
 
  return (
    <div className="category_card" >
       <div className="card">
        <div className="card-img" style={{background: `url(${image}) center center`, backgroundSize: 'cover'}} >

        </div>
        <div className="card-info">
          <p className="text-title">{name}</p>
          <p>Category Name</p>
        </div>
        <div className="card-footer">
        <span className="text-title">{_id}</span>
        <div style={{display: 'flex', gap: '10px'}}>
          <div className="card-button">
            <Image src={remove} alt="df"  />
          </div>
          <div className="card-button">
            <Image src={edit} alt="df" />
          </div>
        </div>
      </div>
      </div>
      
    </div>
  );
};

export default CategoryCard;
