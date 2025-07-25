import { useState, useEffect, useRef } from 'react';
import './ContactManager.css';
import { MdOutlineSearch, MdOutlineSearchOff, MdFilterList, MdAddCircleOutline} from "react-icons/md";
import { FiEdit3 } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Virtual } from "swiper/modules";
import { toast } from 'react-toastify';

const ContactManager = ({ children }) => {
  const [contactsData, setContactsData] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 10;
  const [selectedContact, setSelectedContact] = useState(null);
  const [editedContact, setEditedContact] = useState(null);
  const [mobileSearch, setMobileSearch] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;


  const modalRef = useRef(null);
  const bsModal = useRef(null);


  // Close modal when adding a new contact
  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new window.bootstrap.Modal(modalRef.current);
    }
  }, []);


  // mobile search 
  const handleMobileSearch = () => {
    if (mobileSearch) {
      setSearchTerm('');
    }
    setMobileSearch(!mobileSearch);
  };


  // Fetch all contacts
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;

    fetch(`${API_URL}/api/contacts`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setContactsData(data);
        setAllContacts(data);
      })
      .catch(() => {
        toast.error('Failed to fetch contacts.');
      });
  }, []);


  //Create/Add contact
  const createContact = async (e) => {
    e.preventDefault();

    if (isAdding) return;
    setIsAdding(true);

    const form = e.target;
    const newContact = {
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      phone: form.phone.value,
      email: form.email.value,
      company: form.company.value,
    };

    try {
      const response = await fetch(`${API_URL}/api/add_contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(newContact),
      });

      const result = await response.json();
      toast.success("Contact has been added successfully");
      setCurrentPage(1);
      setContactsData(prev => [result, ...prev]);
      form.reset();
      bsModal.current.hide();
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };




  //Edit contact
  const edit_contact = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/edit_contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(editedContact),
      });

      const result = await response.json();
      toast.success("Contact has been updated successfully");
      setContactsData(prevContacts =>
        prevContacts.map(contact =>
          contact.id === result.id ? result : contact
        )
      );

    } catch (error) {
      console.log(error);
    }
  };

  //Delete contact
  const deleteContact = async () => {
    try {
      await fetch(`${API_URL}/api/delete_contact/${selectedContact.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
        },
      });

      toast.success("Contact has been deleted successfully");
      setContactsData(prev =>
        prev.filter(contact => contact.id !== selectedContact.id)
      );

    } catch (error) {
      console.error('Delete error:', error);
    }
  };


  // filter first, then paginate
  const filteredContacts = contactsData.filter(contact =>
    (contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.phone?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.company?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  // Pagination reset
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // short pagination 
  const getPaginationButtons = () => {
    const buttons = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i)
      }
    } else {
      buttons.push(1)

      if (currentPage > 3) buttons.push('...')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        buttons.push(i)
      }

      if (currentPage < totalPages - 2) buttons.push('...')

      buttons.push(totalPages)
    }
    return buttons
  }

  // Handle filter
  const handleFilter = () => {
    const noPhone = document.getElementById('noPhone').checked;
    const noCompany = document.getElementById('noCompany').checked;

    setCurrentPage(1);

    if (!noPhone && !noCompany) {
      setContactsData(allContacts);
      return;
    }

    const filtered = allContacts.filter(contact => {
      const phoneMissing = !contact.phone?.trim();
      const companyMissing = !contact.company?.trim();

      if (noPhone && noCompany) {
        return phoneMissing || companyMissing;
      }

      if (noPhone) return phoneMissing;
      if (noCompany) return companyMissing;

      return true;
    });

    setContactsData(filtered);
  };

  return (
    <section className='contact-manager container'>
      {children && children(setContactsData)}
      <div className='contacts-header position-relative row'>
        <div className='cm-left d-flex justify-content-between col-12 col-md-8 col-sm-10'>
          <h2 className='fw-bold mb-0 d-flex align-items-center'>Contacts</h2>
          <button
            className='add-contact d-flex justify-content-between align-items-center radius'
            data-bs-toggle='modal'
            data-bs-target='#addContactModal'
            aria-label='Add contact'
          >
            <MdAddCircleOutline  className='me-1' /> <span>Add manually</span>
          </button>
        </div>

        <div className='cm-right col-12 col-md-4 col-sm-2 d-flex justify-content-center justify-content-md-end align-items-center mt-0'>
          <div className={`search w-100 me-2 ${mobileSearch ? 'is-active' : ''}`}>
            <div className={`desktop-search position-relative`}>
              <MdOutlineSearch
                className='position-absolute top-50 translate-middle-y'
                style={{ left: '10px', color: '#737373', pointerEvents: 'none', fontSize: '22px' }}
              />
              <input
                type='text'
                placeholder='Search'
                className='form-control ps-5'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {/* mobile search icon */}
          <div className="main-mobile-wrapper d-flex">
            <div className='mobile-search text-end me-2'>
              <button onClick={handleMobileSearch} className={mobileSearch ? 'is-active' : ''} aria-label='Search'>
                <span style={{ display: mobileSearch ? 'none' : 'inline' }}>
                  <MdOutlineSearch style={{ fontSize: '22px' }} />
                </span>
                <span style={{ display: mobileSearch ? 'inline' : 'none' }}>
                  <MdOutlineSearchOff style={{ fontSize: '22px' }} />
                </span>
              </button>
            </div>
            <div className='filter'>
              <button
                type='button'
                className='btn btn-outline-secondary'
                data-bs-toggle='modal'
                data-bs-target='#filterModal'
                aria-label='Filter'
              >
                <MdFilterList style={{ fontSize: '22px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Add Contact Modal */}
        <div className='modal fade' id='addContactModal' tabIndex='-1' aria-hidden='true' ref={modalRef}>
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title text-primary'>Add Contact</h5>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Add contact'></button>
              </div>
              <form method="POST" onSubmit={createContact}>
                <div className='modal-body'>
                  <input type="text" name="first_name" className='form-control mb-2' placeholder='First Name' required />
                  <input type="text" name="last_name" className='form-control mb-2' placeholder='Last Name' required />
                  <input type="text" name="phone" className='form-control mb-2' placeholder='Phone' />
                  <input type="email" name="email" className='form-control mb-2' placeholder='Email' required />
                  <input type="text" name="company" className='form-control mb-2' placeholder='Company' />

                </div>
                <div className='modal-footer'>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    aria-label="Add contact"
                    disabled={isAdding}
                  >
                    {isAdding ? 'Adding...' : 'Add Contact'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/*desktop table */}
      <div className='contacts-tabele d-none d-md-block mt-4'>
        <table className='custom-table w-100'>
          <thead>
            <tr>
              <th>ID</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.length > 0 ? (
              currentContacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.id}</td>
                  <td>{contact.first_name}</td>
                  <td>{contact.last_name}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.email}</td>
                  <td>{contact.company}</td>
                  <td>
                    <button
                      className='btn text-primary fs-5 me-2'
                      data-bs-toggle='modal'
                      data-bs-target='#editContactModal'
                      onClick={() => {
                        setSelectedContact(contact)
                        setEditedContact({ ...contact })
                      }}
                      aria-label='Edit contact'
                    >
                      <FiEdit3 />
                    </button>
                    <button
                      className='btn text-danger fs-5'
                      data-bs-toggle='modal'
                      data-bs-target='#confirmDeleteModal'
                      id={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      aria-label='Delete contact'
                    >
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='7' className='text-center py-4'>
                  <p className='mb-1 fw-semibold'>You have no contacts yet.</p>
                  <small>
                    Add meeting notes to extract contacts, or{' '}
                    <a href='/' className='text-decoration-underline text-primary' data-bs-toggle='modal'
                      data-bs-target='#addContactModal'>
                      add a contact manually.
                    </a>
                  </small>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className='pagination d-flex justify-content-center mt-3'>
            {getPaginationButtons().map((btn, i) =>
              btn === '...' ? (
                <span key={i} className='px-2 text-muted'>...</span>
              ) : (
                <button
                  key={i}
                  className={`page-btn btn ${currentPage === btn ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                  onClick={() => handlePageChange(btn)}
                  aria-label='Current page'
                >
                  {btn}
                </button>
              )
            )}

          </div>
        )}
      </div>

      {/* Delete Modal */}
      <div className='modal fade' id='confirmDeleteModal' tabIndex='-1' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title text-primary'>Are you sure you want to delete contact?</h5>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close modal'></button>
            </div>
            <div className='modal-footer d-flex justify-content-center'>
              <button type='button' className='btn btn-secondary px-4' data-bs-dismiss='modal' aria-label='Close modal'>
                No
              </button>
              <button
                type='button'
                className='btn btn-danger px-4'
                onClick={deleteContact}
                data-bs-dismiss='modal'
                aria-label='Delete contact'
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter modal */}
      <div className="modal fade" id="filterModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Filter Users</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              <form id="filterForm">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="noPhone" />
                  <label className="form-check-label" htmlFor="noPhone">
                    Users without phone number
                  </label>
                </div>

                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="noCompany" />
                  <label className="form-check-label" htmlFor="noCompany">
                    Users without company
                  </label>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleFilter}>Apply Filters</button>
            </div>

          </div>
        </div>
      </div>


      {/* Edit Modal */}
      <div className='modal fade' id='editContactModal' tabIndex='-1' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title text-primary'>Edit Contact</h5>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close modal'></button>
            </div>
            <form onSubmit={edit_contact}>
              <div className='modal-body'>
                <input
                  className='form-control mb-2'
                  placeholder='First Name'
                  value={editedContact?.first_name || ''}
                  onChange={(e) => setEditedContact({ ...editedContact, first_name: e.target.value })}
                />
                <input
                  className='form-control mb-2'
                  placeholder='Last Name'
                  value={editedContact?.last_name || ''}
                  onChange={(e) => setEditedContact({ ...editedContact, last_name: e.target.value })}
                />
                <input
                  className='form-control mb-2'
                  placeholder='Phone'
                  value={editedContact?.phone || ''}
                  onChange={(e) => setEditedContact({ ...editedContact, phone: e.target.value })}
                />
                <input
                  className='form-control mb-2'
                  placeholder='Email'
                  value={editedContact?.email || ''}
                  onChange={(e) => setEditedContact({ ...editedContact, email: e.target.value })}
                />
                <input
                  className='form-control mb-2'
                  placeholder='Company'
                  value={editedContact?.company || ''}
                  onChange={(e) => setEditedContact({ ...editedContact, company: e.target.value })}
                />
              </div>
              <div className='modal-footer d-flex justify-content-center'>
                <button type='button' className='btn btn-secondary px-4' data-bs-dismiss='modal' aria-label='Close modal'>
                  Cancel
                </button>
                <button type='submit' className='btn btn-primary px-4' data-bs-dismiss='modal' aria-label='Edit contact'>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Cards with React swiper */}
      <div className="mobile-cards d-block d-md-none mt-4">
        <Swiper
          slidesPerView={2}
          spaceBetween={20}
          pagination={{ type: 'progressbar' }}
          modules={[Pagination, Virtual]}
          virtual
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            568: {
              slidesPerView: 2,
            },
          }}
          className="mySwiper"
        >
          {filteredContacts.map((contact, idx) => (
            <SwiperSlide key={idx} virtualIndex={idx}>
              <div className="mobile-contacts card p-3 mb-3 shadow-sm">
                <p><strong>ID:</strong> {contact.id}</p>
                <p><strong>First name:</strong> {contact.first_name}</p>
                <p><strong>Last name:</strong> {contact.last_name}</p>
                <p><strong>Phone:</strong> {contact.phone}</p>
                <p><strong>Email:</strong> {contact.email}</p>
                <p><strong>Company:</strong> {contact.company}</p>

                <div className="mobile-buttons d-flex justify-content-end mt-3">
                  <button
                    className="btn text-primary fs-5 me-3"
                    data-bs-toggle="modal"
                    data-bs-target="#editContactModal"
                    onClick={() => {
                      setSelectedContact(contact);
                      setEditedContact({ ...contact });
                    }}
                    aria-label='Open edit contact modal'
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    className="btn text-danger fs-5"
                    data-bs-toggle="modal"
                    data-bs-target="#confirmDeleteModal"
                    id={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    aria-label='Open delete contact modal'
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default ContactManager;
