import React from 'react'
import './cards(PC).css'
import './cards(mobile).css'
import './cards(tablet).css'
export default function Cards(props) {
  function isImage(url) {
    console.log(url.status);
  }
  return (
    <div className="card_container">
      <div className="card_image">
        {/* <img src={props.avatar}/> */}
      </div>

      <div className="card_personal_info">
        <div className="card_personal_info_name">{props.name}</div>
        <div className="card_personal_info_email">{props.email}</div>
      </div>

      <div className="card_product_info">
        <div className="card_product_info_country">{props.country}</div>
        <div className="card_product_info_vehicle">{props.vehicle}</div>
      </div>
    </div>
  )
}
