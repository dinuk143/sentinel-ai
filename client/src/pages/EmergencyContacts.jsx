import {

  useEffect,

  useState

} from "react";
import toast from "react-hot-toast";



import {

  FaUserShield,

  FaPlus,

  FaUser,

  FaPhoneAlt,

  FaUsers,

  FaEdit,

  FaTrash,

  FaTimes,

  FaSave,

  FaShieldAlt

} from "react-icons/fa";



import API from "../api/api";

import { getToken } from "../utils/auth";



import "../styles/emergency-contacts.css";





function EmergencyContacts() {



  const [contacts, setContacts] =

    useState([]);



  const [loading, setLoading] =

    useState(true);



  const [error, setError] =

    useState("");



  const [message, setMessage] =

    useState("");



  const [showForm, setShowForm] =

    useState(false);



  const [editingId, setEditingId] =

    useState(null);



  const [saving, setSaving] =

    useState(false);



  const [deletingId, setDeletingId] =

    useState(null);





  const [formData, setFormData] =

    useState({

      contact_name: "",

      relationship: "",

      phone: ""

    });





  // ========================================

  // LOAD CONTACTS

  // ========================================



  useEffect(() => {

    fetchContacts();

  }, []);





  const fetchContacts = async () => {



    try {



      setLoading(true);

      setError("");



      const response = await API.get(

        "/emergency-contacts",

        {

          headers: {

            Authorization:

              `Bearer ${getToken()}`

          }

        }

      );



      setContacts(

        Array.isArray(

          response.data?.contacts

        )

          ? response.data.contacts

          : []

      );



    } catch (err) {



      console.error(

        "CONTACT FETCH ERROR:",

        err

      );



      setError(

        err.response?.data?.message ||

        "Unable to load emergency contacts."

      );



    } finally {



      setLoading(false);



    }



  };





  // ========================================

  // INPUT CHANGE

  // ========================================



  const handleChange = (event) => {



    const {

      name,

      value

    } = event.target;



    setFormData(

      (current) => ({

        ...current,

        [name]: value

      })

    );



  };





  // ========================================

  // OPEN ADD FORM

  // ========================================



  const openAddForm = () => {



    setEditingId(null);



    setFormData({

      contact_name: "",

      relationship: "",

      phone: ""

    });



    setError("");

    setMessage("");

    setShowForm(true);



  };





  // ========================================

  // OPEN EDIT FORM

  // ========================================



  const openEditForm = (contact) => {



    setEditingId(contact.id);



    setFormData({

      contact_name:

        contact.contact_name || "",



      relationship:

        contact.relationship || "",



      phone:

        contact.phone || ""

    });



    setError("");

    setMessage("");

    setShowForm(true);



    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });



  };





  // ========================================

  // CLOSE FORM

  // ========================================



  const closeForm = () => {



    if (saving) return;



    setShowForm(false);

    setEditingId(null);



    setFormData({

      contact_name: "",

      relationship: "",

      phone: ""

    });



  };





  // ========================================

  // SAVE CONTACT

  // ========================================



  const handleSubmit = async (event) => {



    event.preventDefault();

    if (saving) return;

    const contactName =

      formData.contact_name.trim();



    const phone =

      formData.phone.trim();



    if (!contactName || !phone) {

      toast.error(
        "Contact name and mobile number are required."
      );

      return;

    }

    if (!navigator.onLine) {

      toast.error(
        "You are offline. Connect to the internet to save this contact."
      );

      return;

    }





    try {



      setSaving(true);

      setError("");

      setMessage("");



      const payload = {



        contact_name:

          contactName,



        relationship:

          formData.relationship.trim(),



        phone:

          phone

      };





      if (editingId) {



        await API.put(

          `/emergency-contacts/${editingId}`,

          payload,

          {

            headers: {

              Authorization:

                `Bearer ${getToken()}`

            }

          }

        );



        toast.success(
          "Emergency contact updated successfully."
        );



      } else {



        await API.post(

          "/emergency-contacts",

          payload,

          {

            headers: {

              Authorization:

                `Bearer ${getToken()}`

            }

          }

        );



        toast.success(
          "Emergency contact added successfully."
        );



      }





      setShowForm(false);

      setEditingId(null);



      setFormData({

        contact_name: "",

        relationship: "",

        phone: ""

      });



      await fetchContacts();





    } catch (err) {



      console.error(

        "CONTACT SAVE ERROR:",

        err

      );



      toast.error(
        !navigator.onLine
          ? "Internet connection was lost. Please try again."
          : err.response?.data?.message ||
            "Unable to save emergency contact."
      );



    } finally {



      setSaving(false);



    }



  };





  // ========================================

  // DELETE CONTACT

  // ========================================



  const handleDelete = async (

    contact

  ) => {

    if (deletingId !== null) return;

    const confirmed =

      window.confirm(

        `Remove ${contact.contact_name} from your emergency contacts?`

      );



    if (!confirmed) return;

    if (!navigator.onLine) {

      toast.error(
        "You are offline. Connect to the internet to delete this contact."
      );

      return;

    }

    try {



      setDeletingId(contact.id);



      setError("");

      setMessage("");



      await API.delete(

        `/emergency-contacts/${contact.id}`,

        {

          headers: {

            Authorization:

              `Bearer ${getToken()}`

          }

        }

      );





      setContacts(

        (currentContacts) =>

          currentContacts.filter(

            (item) =>

              item.id !== contact.id

          )

      );





      toast.success(
        "Emergency contact removed."
      );





      if (

        editingId === contact.id

      ) {



        closeForm();



      }





    } catch (err) {



      console.error(

        "CONTACT DELETE ERROR:",

        err

      );



      toast.error(
        !navigator.onLine
          ? "Internet connection was lost. Please try again."
          : err.response?.data?.message ||
            "Unable to delete emergency contact."
      );



    } finally {



      setDeletingId(null);



    }



  };





  // ========================================

  // PHONE DISPLAY

  // ========================================



  const formatPhone = (phone) => {



    if (!phone) return "Not available";



    if (

      phone.startsWith("+91") &&

      phone.length === 13

    ) {



      return (

        "+91 " +

        phone.slice(3, 8) +

        " " +

        phone.slice(8)

      );



    }



    return phone;



  };





  return (



    <main className="emergency-contacts-page">



      <div className="contacts-container">





        {/* ================= HEADER ================= */}



        <section className="contacts-hero">



          <div className="contacts-hero-icon">

            <FaUserShield />

          </div>



          <div className="contacts-hero-content">



            <span className="contacts-eyebrow">

              SENTINEL SAFETY NETWORK

            </span>



            <h1>

              Emergency Contacts

            </h1>



            <p>

              Add trusted people who can be

              quickly alerted when you report

              an emergency through Sentinel AI.

            </p>



          </div>



          <button

            type="button"

            className="add-contact-button"

            onClick={openAddForm}

          >

            <FaPlus />

            Add Contact

          </button>



        </section>





        {/* ================= INFO BAR ================= */}



        <section className="contacts-summary">



          <div className="summary-icon">

            <FaUsers />

          </div>



          <div>



            <span>

              Trusted Contacts

            </span>



            <strong>

              {contacts.length}

            </strong>



          </div>



          <p>

            No contact-count limit.

            Add the trusted people you may

            need during an emergency.

          </p>



        </section>





        {/* ================= MESSAGES ================= */}



        {error && (



          <div className="contact-alert contact-error">

            {error}

          </div>



        )}





        {message && (



          <div className="contact-alert contact-success">

            {message}

          </div>



        )}





        {/* ================= FORM ================= */}



        {showForm && (



          <section className="contact-form-card">



            <div className="contact-form-header">



              <div>



                <span>

                  {editingId

                    ? "UPDATE CONTACT"

                    : "NEW TRUSTED CONTACT"}

                </span>



                <h2>

                  {editingId

                    ? "Edit Emergency Contact"

                    : "Add Emergency Contact"}

                </h2>



              </div>





              <button

                type="button"

                className="close-contact-form"

                onClick={closeForm}

                aria-label="Close form"

              >

                <FaTimes />

              </button>



            </div>





            <form

              className="contact-form"

              onSubmit={handleSubmit}

            >



              <div className="contact-field">



                <label

                  htmlFor="contact_name"

                >

                  Contact Name *

                </label>



                <div className="contact-input-wrap">



                  <FaUser />



                  <input

                    id="contact_name"

                    name="contact_name"

                    type="text"

                    placeholder="e.g. Mom"

                    value={

                      formData.contact_name

                    }

                    onChange={handleChange}

                    maxLength="100"

                    autoComplete="name"

                    required

                  />



                </div>



              </div>





              <div className="contact-field">



                <label

                  htmlFor="relationship"

                >

                  Relationship

                </label>



                <div className="contact-input-wrap">



                  <FaUsers />



                  <input

                    id="relationship"

                    name="relationship"

                    type="text"

                    placeholder="e.g. Mother"

                    value={

                      formData.relationship

                    }

                    onChange={handleChange}

                    maxLength="50"

                  />



                </div>



              </div>





              <div className="contact-field">



                <label

                  htmlFor="phone"

                >

                  Mobile Number *

                </label>



                <div className="contact-input-wrap">



                  <FaPhoneAlt />



                  <input

                    id="phone"

                    name="phone"

                    type="tel"

                    inputMode="tel"

                    placeholder="e.g. 9876543210"

                    value={

                      formData.phone

                    }

                    onChange={handleChange}

                    maxLength="20"

                    autoComplete="tel"

                    required

                  />



                </div>



                <small>

                  Indian 10-digit numbers will

                  automatically be saved with

                  the +91 country code.

                </small>



              </div>





              <div className="contact-form-actions">



                <button

                  type="button"

                  className="cancel-contact-button"

                  onClick={closeForm}

                  disabled={saving}

                >

                  Cancel

                </button>





                <button

                  type="submit"

                  className="save-contact-button"

                  disabled={saving}

                >



                  <FaSave />



                  {saving

                    ? "Saving..."

                    : editingId

                    ? "Update Contact"

                    : "Save Contact"}



                </button>



              </div>



            </form>



          </section>



        )}





        {/* ================= CONTENT ================= */}



        {loading ? (



          <section className="contacts-state-card">



            <div className="contact-loader" />



            <h3>

              Loading trusted contacts...

            </h3>



            <p>

              Sentinel AI is retrieving your

              emergency contact list.

            </p>



          </section>



        ) : contacts.length === 0 ? (



          <section className="contacts-state-card empty-contacts">



            <div className="empty-contact-icon">

              <FaUserShield />

            </div>



            <h2>

              No Emergency Contacts Yet

            </h2>



            <p>

              Add someone you trust so they

              can be included in your

              emergency alert flow.

            </p>



            <button

              type="button"

              className="empty-add-button"

              onClick={openAddForm}

            >

              <FaPlus />

              Add Your First Contact

            </button>



          </section>



        ) : (



          <section className="contacts-list-section">



            <div className="contacts-section-heading">



              <div>



                <span>

                  YOUR SAFETY NETWORK

                </span>



                <h2>

                  Trusted Contacts

                </h2>



              </div>



              <div className="contact-count-badge">

                {contacts.length}

              </div>



            </div>





            <div className="contacts-grid">



              {contacts.map(

                (contact, index) => (



                  <article

                    className="trusted-contact-card"

                    key={contact.id}

                  >



                    <div className="contact-card-top">



                      <div className="contact-avatar">

                        <FaUser />

                      </div>



                      <div className="contact-number">

                        #{index + 1}

                      </div>



                    </div>





                    <div className="contact-details">



                      <h3>

                        {contact.contact_name}

                      </h3>



                      <span className="relationship-badge">

                        {contact.relationship ||

                          "Trusted Contact"}

                      </span>





                      <div className="contact-phone">



                        <FaPhoneAlt />



                        <span>

                          {formatPhone(

                            contact.phone

                          )}

                        </span>



                      </div>



                    </div>





                    <div className="contact-card-status">



                      <FaShieldAlt />



                      <span>

                        Ready for SOS alerts

                      </span>



                    </div>





                    <div className="contact-card-actions">



                      <button

                        type="button"

                        className="edit-contact-button"

                        onClick={() =>

                          openEditForm(

                            contact

                          )

                        }

                      >

                        <FaEdit />

                        Edit

                      </button>





                      <button

                        type="button"

                        className="delete-contact-button"

                        disabled={

                          deletingId ===

                          contact.id

                        }

                        onClick={() =>

                          handleDelete(

                            contact

                          )

                        }

                      >

                        <FaTrash />



                        {deletingId ===

                        contact.id

                          ? "Removing..."

                          : "Delete"}



                      </button>



                    </div>



                  </article>



                )

              )}



            </div>



          </section>



        )}





        {/* ================= FOOTER NOTE ================= */}



        <section className="contacts-safety-note">



          <FaShieldAlt />



          <div>



            <strong>

              Emergency Alert Ready

            </strong>



            <p>

              These contacts will be available

              to the Sentinel SOS alert feature.

              Sending an SMS will still require

              confirmation in your phone's

              messaging app.

            </p>



          </div>



        </section>



      </div>



    </main>



  );



}





export default EmergencyContacts;