import React, { useState, useEffect } from "react";
import axios from "axios";
import * as yup from 'yup';

const ENDPOINT = 'https://webapis.bloomtechdev.com/registration';

const e = {
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  usernameReq: 'username is required',
  favFoodReq: 'a favorite food must be selected',
  agreementReq: 'the agreement must be accepted'
}

const formSchema = yup.object().shape({
  username: yup
    .string()
    .required(e.usernameReq)
    .min(3, e.usernameMin)
    .max(20, e.usernameMax),
  favFood: yup
    .string()
    .oneOf(['broccoli', 'spaghetti', 'pizza'], e.favFoodReq),
  favLanguage: yup
    .string()
    .required(),
  agreement: yup
    .boolean()
    .oneOf([true], e.agreementReq)
});

const initialFormValues = {
  agreement: false,
  favFood: '',
  favLanguage: '',
  username: ''
}
const initialErrors = {
  agreement: '',
  favFood: '',
  favLanguage: '',
  username: ''
}

function App() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState(initialErrors);
  const [enabled, setEnabled] = useState(true);
  const [success, setSuccess] = useState(null);
  const [failure, setFailure] = useState(null);

  useEffect(() => {
    formSchema.isValid(formValues).then(isValid => {
      setEnabled(isValid);
    })
  }, [formValues]);

  const onChange = evt => {
    let { name, value, type, checked } = evt.target;
    if (type === "checkbox") {
      value = checked;
    }
    setFormValues({ ...formValues, [name]: value });
    yup
      .reach(formSchema, name)
      .validate(value)
      .then(() => {
        setErrors({ ...errors, [name]: '' })
      })
      .catch((err) => {
        setErrors({ ...errors, [name]: err.message })
      })
  }
  
  
  const onSubmit = evt => {
    evt.preventDefault();
    setEnabled(false);
    axios.post(ENDPOINT, formValues)
      .then(res => {
        setFormValues(initialFormValues);
        setSuccess(res.data.message);
        setFailure('')
        setTimeout(() => {
          setSuccess('')
        }, 5000);
      })
      .catch(err => {
        setFailure(err.response.data.message);
        setSuccess('');
      })
  }

  return (
      <div>
        <h2>Create an Account</h2>
        <form onSubmit={onSubmit}>
          {success && <h4 className="success">{success}</h4>}
          {failure && <h4 className="error">{failure}</h4>}
          <div className="inputGroup">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Type Username"
              value={formValues.username}
              onChange={onChange}
            />
            {errors.username && <div className="validation">{errors.username}</div>}
          </div>
          <div className="inputGroup">
            <fieldset>
              <legend>Favorite Language:</legend>
              <label>
                <input
                  type="radio"
                  id="javascript"
                  name="favLanguage"
                  value="javascript"
                  onChange={onChange}
                  checked={formValues.favLanguage === 'javascript'}
                />
                JavaScript
              </label>
              <label>
                <input
                type="radio"
                id="rust"
                name="favLanguage"
                value="rust"
                onChange={onChange}
                checked={formValues.favLanguage === 'rust'}
              />
                Rust
              </label>
            </fieldset>
          </div>
          <div className="inputGroup">
            <label htmlFor="favFood">Favorite Food:</label>
            <select name="favFood" id="favFood" onChange={onChange} value={formValues.favFood}>
              <option value="">--Select Favorite Food--</option>
              <option value="pizza">Pizza</option>
              <option value="spaghetti">Spaghetti</option>
              <option value="broccoli">Broccoli</option>
            </select>
            {errors.favFood && <div className="validation">{errors.favFood}</div>}
          </div>
          <div className="inputGroup">
            <label>
              <input
                type="checkbox"
                name="agreement"
                id="agreement"
                onChange={onChange}
                checked={formValues.agreement} />
              Agree to our terms
            </label>
            {errors.agreement && <div className="validation">{errors.agreement}</div>}
          </div>
          <div>
            <input type="submit" disabled={!enabled} />
          </div>
        </form>
      </div>
  )
}

export default App;