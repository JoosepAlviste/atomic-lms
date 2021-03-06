/* eslint-disable jsx-a11y/label-has-for */
import * as React from 'react';
import style from './Radio.scss';

type Props = {
  id: string,
  name: string,
  value: string | number,
  className?: string,
  children: React.Node,
  onChange: (Event) => null,
};

const Radio = (props: Props) => (
  <div className={`control is-expanded ${props.className}`}>
    <input
      type="radio"
      id={props.id}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      className={style.radio}
    />
    <label
      htmlFor={props.id}
      className={`radio ${style.label}`}
    >
      {props.children}
    </label>
  </div>
);

Radio.defaultProps = {
  className: '',
};

export default Radio;
