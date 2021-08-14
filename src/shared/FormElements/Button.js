import React from 'react';
import { NavLink } from 'react-router-dom'

import './Button.css';

const Button = props => {
  if (props.href) {
    return (
      <a target="_blank" rel="noopener noreferrer external" href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <NavLink
        onClick={props.onClick}
        to={props.to}
        exact={props.exact}
      >
        {props.children}
      </NavLink>
    );
  }
  return (
    <button
      style={{ padding: props.padding, margin: props.margin }}
      className={`button button--${props.size || 'default'} ${props.inverse &&
        'button--inverse'} ${props.danger && 'button--danger'}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;