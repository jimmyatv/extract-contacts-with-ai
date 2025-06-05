import React from 'react'
import './ContactManager.css'
import { IoMdAddCircleOutline } from 'react-icons/io'

const ContactManager = () => {
    return (
        <section className='contact-manager container row'>
            <div className='cm-left d-flex justify-content-between col-9'>
                <h4 className='fw-bold'>Contacts</h4>
                <button
                    className='add-contact d-flex d-flex justify-content-between align-items-center radius'
                    data-bs-toggle='modal'
                    data-bs-target='#addContactModal'
                >
                    <IoMdAddCircleOutline className='me-1' /> Add manually
                </button>
            </div>

            <div className='cm-right col-3'>Right size</div>

            {/* Modal - popup */}
            <div
                className='modal fade'
                id='addContactModal'
                tabIndex='-1'
                aria-labelledby='addContactModalLabel'
                aria-hidden='true'
            >
                <div className='modal-dialog modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='addContactModalLabel'>
                                Add Contact
                            </h5>
                            <button
                                type='button'
                                className='btn-close'
                                data-bs-dismiss='modal'
                                aria-label='Close'
                            ></button>
                        </div>
                        <div className='modal-body'>
                            <form>
                                <input className='form-control mb-2' placeholder='First Name' />
                                <input className='form-control mb-2' placeholder='Last Name' />
                                <input className='form-control mb-2' placeholder='Phone' />
                                <input className='form-control mb-2' placeholder='Email' />
                                <input className='form-control mb-2' placeholder='Company' />
                                <textarea
                                    className='form-control mb-3'
                                    rows='3'
                                    placeholder='Notes'
                                ></textarea>
                            </form>
                        </div>
                        <div className='modal-footer'>
                            <button
                                type='button'
                                className='btn btn-secondary'
                                data-bs-dismiss='modal'
                            >
                                Cancel
                            </button>
                            <button type='button' className='btn btn-primary'>
                                Add Contact
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContactManager
