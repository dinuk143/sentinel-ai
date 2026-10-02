import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";



import {

  FaHistory,

  FaSearch,

  FaClipboardList,

  FaClock,

  FaCheckCircle,

  FaHeartbeat,

  FaMapMarkerAlt,

  FaRobot,

  FaCalendarAlt,

  FaImage,

  FaExternalLinkAlt,

  FaSyncAlt,

  FaExclamationTriangle,

  FaShieldAlt,

  FaFilter

} from "react-icons/fa";



import API from "../api/api";

import { getToken } from "../utils/auth";



import "../styles/reports.css";





function Reports() {



  // ================= STATE =================



  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  const [updatingReportId, setUpdatingReportId] =

    useState(null);



  const [searchTerm, setSearchTerm] =

    useState("");



  const [statusFilter, setStatusFilter] =

    useState("All");





  // ================= LOAD REPORTS =================



  useEffect(() => {

    fetchReports();

  }, []);





  // ================= FETCH REPORTS =================



  const fetchReports = async () => {



    try {



      setLoading(true);

      setError("");



      const res = await API.get(

        "/reports/my-reports",

        {

          headers: {

            Authorization:

              `Bearer ${getToken()}`

          }

        }

      );



      setReports(

        Array.isArray(res.data)

          ? res.data

          : []

      );



    } catch (err) {



      console.error(

        "REPORT FETCH ERROR:",

        err

      );



      setError(

        err.response?.data?.message ||

        "Unable to load your emergency reports."

      );



    } finally {



      setLoading(false);



    }



  };





  // ================= MARK AS RESOLVED =================



  const markAsResolved = async (reportId) => {

    if (updatingReportId !== null) return;

    if (!navigator.onLine) {
      toast.error(
        "You are offline. Connect to the internet to update this report."
      );
      return;
    }

    try {

      setUpdatingReportId(reportId);

      await API.patch(
        `/reports/${reportId}/status`,
        {
          status: "Resolved"
        },
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`
          }
        }
      );

      // Update report instantly in UI
      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === reportId
            ? {
                ...report,
                status: "Resolved"
              }
            : report
        )
      );

      toast.success(
        `Report #${reportId} marked as resolved.`
      );

    } catch (err) {

      console.error(
        "STATUS UPDATE ERROR:",
        err
      );

      toast.error(
        !navigator.onLine
          ? "Internet connection was lost. Please try again."
          : err.response?.data?.message ||
            "Unable to update report status."
      );

    } finally {

      setUpdatingReportId(null);

    }

  };



  // ================= IMAGE URL =================



  const getImageUrl = (filePath) => {



    if (!filePath) {

      return null;

    }





    if (

      filePath.startsWith("http://") ||

      filePath.startsWith("https://")

    ) {

      return filePath;

    }





    const normalizedPath =
      filePath.replace(/\\/g, "/");





    const uploadsIndex =

      normalizedPath

        .toLowerCase()

        .lastIndexOf("/uploads/");





    if (uploadsIndex !== -1) {



      const relativePath =

        normalizedPath.substring(

          uploadsIndex + 1

        );



      return `http://localhost:5000/${relativePath}`;



    }





    const cleanPath =

      normalizedPath.replace(
        /^\/+/,

        ""

      );





    return `http://localhost:5000/${cleanPath}`;



  };





  // ================= STATUS CLASS =================



  const getStatusClass = (

    status = ""

  ) => {



    if (

      status.toLowerCase() ===

      "resolved"

    ) {



      return "record-status-resolved";



    }



    return "record-status-pending";



  };





  // ================= SEVERITY CLASS =================



  const getSeverityClass = (

    severity = ""

  ) => {



    const value =

      severity.toLowerCase();





    if (

      value === "critical" ||

      value === "high"

    ) {



      return "record-severity-critical";



    }





    if (

      value === "medium" ||

      value === "moderate"

    ) {



      return "record-severity-medium";



    }





    if (value === "low") {



      return "record-severity-low";



    }





    return "record-severity-unknown";



  };





  // ================= DATE =================



  const formatDate = (date) => {



    if (!date) {



      return "Date unavailable";



    }





    return new Date(date)

      .toLocaleString(

        undefined,

        {

          dateStyle: "medium",

          timeStyle: "short"

        }

      );



  };





  // ================= LOCAL STATS =================



  const reportStats = useMemo(() => {



    const total =

      reports.length;





    const pending =

      reports.filter(

        (report) =>

          (report.status || "Pending")

            .toLowerCase() !==

          "resolved"

      ).length;





    const resolved =

      reports.filter(

        (report) =>

          (report.status || "")

            .toLowerCase() ===

          "resolved"

      ).length;





    return {

      total,

      pending,

      resolved

    };



  }, [reports]);





  // ================= FILTER REPORTS =================



  const filteredReports =

    useMemo(() => {



      const search =

        searchTerm

          .trim()

          .toLowerCase();





      return reports.filter(

        (report) => {



          const status =

            report.status ||

            "Pending";





          const matchesStatus =

            statusFilter === "All" ||

            status.toLowerCase() ===

              statusFilter.toLowerCase();





          const searchableText = [

            report.id,

            report.emergency_type,

            report.address,

            report.severity,

            report.status

          ]

            .filter(Boolean)

            .join(" ")

            .toLowerCase();





          const matchesSearch =

            !search ||

            searchableText.includes(

              search

            );





          return (

            matchesStatus &&

            matchesSearch

          );



        }

      );



    }, [

      reports,

      searchTerm,

      statusFilter

    ]);





  // ================= LOADING =================



  if (loading) {



    return (



      <main className="reports-page">



        <div className="reports-loading">



          <div className="reports-loader">

            <FaHistory />

          </div>



          <h2>

            Loading Emergency Records

          </h2>



          <p>

            Retrieving your submitted SOS

            reports...

          </p>



        </div>



      </main>



    );



  }





  // ================= PAGE =================



  return (



    <main className="reports-page">



      <div

        className="reports-glow reports-glow-blue"

      />



      <div

        className="reports-glow reports-glow-red"

      />





      <div className="reports-container">





        {/* ================= HEADER ================= */}



        <header className="reports-header">



          <div>



            <div className="reports-eyebrow">



              <span />



              EMERGENCY RECORDS CENTER



            </div>





            <div className="reports-title-row">



              <div className="reports-title-icon">

                <FaHistory />

              </div>





              <div>



                <h1>

                  My Emergency Reports

                </h1>



                <p>

                  Review your submitted SOS

                  reports, emergency details and

                  AI-assisted guidance.

                </p>



              </div>



            </div>



          </div>





          <button

            type="button"

            className="reports-refresh"

            onClick={fetchReports}

          >



            <FaSyncAlt />



            Refresh Records



          </button>



        </header>





        {/* ================= ERROR ================= */}



        {error && (



          <section className="reports-error">



            <FaExclamationTriangle />





            <div>



              <strong>

                Unable to load records

              </strong>



              <span>

                {error}

              </span>



            </div>





            <button

              type="button"

              onClick={fetchReports}

            >



              Try Again



            </button>



          </section>



        )}





        {!error && (



          <>



            {/* ================= STATS ================= */}



            <section className="reports-summary">





              {/* TOTAL */}



              <div

                className="

                  report-summary-card

                  summary-total

                "

              >



                <div className="summary-icon">

                  <FaClipboardList />

                </div>





                <div>



                  <span>

                    TOTAL RECORDS

                  </span>



                  <strong>

                    {reportStats.total}

                  </strong>



                  <p>

                    Emergency reports

                  </p>



                </div>



              </div>





              {/* PENDING */}



              <div

                className="

                  report-summary-card

                  summary-pending

                "

              >



                <div className="summary-icon">

                  <FaClock />

                </div>





                <div>



                  <span>

                    PENDING

                  </span>



                  <strong>

                    {reportStats.pending}

                  </strong>



                  <p>

                    Pending records

                  </p>



                </div>



              </div>





              {/* RESOLVED */}



              <div

                className="

                  report-summary-card

                  summary-resolved

                "

              >



                <div className="summary-icon">

                  <FaCheckCircle />

                </div>





                <div>



                  <span>

                    RESOLVED

                  </span>



                  <strong>

                    {reportStats.resolved}

                  </strong>



                  <p>

                    Resolved records

                  </p>



                </div>



              </div>



            </section>





            {/* ================= SEARCH / FILTER ================= */}



            <section className="reports-toolbar">





              <div className="reports-search">



                <FaSearch />





                <input

                  type="text"

                  placeholder="Search emergency, location, severity or report ID..."

                  value={searchTerm}

                  onChange={(e) =>

                    setSearchTerm(

                      e.target.value

                    )

                  }

                />



              </div>





              <div className="reports-filter">



                <FaFilter />





                <select

                  value={statusFilter}

                  onChange={(e) =>

                    setStatusFilter(

                      e.target.value

                    )

                  }

                >



                  <option value="All">

                    All Status

                  </option>



                  <option value="Pending">

                    Pending

                  </option>



                  <option value="Resolved">

                    Resolved

                  </option>



                </select>



              </div>





              <div className="records-found">



                <strong>

                  {filteredReports.length}

                </strong>



                <span>



                  RECORD



                  {filteredReports.length === 1

                    ? ""

                    : "S"}



                </span>



              </div>



            </section>





            {/* ================= EMPTY DATABASE ================= */}



            {reports.length === 0 && (



              <section className="reports-empty">



                <div className="reports-empty-icon">

                  <FaClipboardList />

                </div>





                <h2>

                  No Emergency Reports

                </h2>





                <p>

                  Your submitted SOS reports

                  will appear here.

                </p>



              </section>



            )}





            {/* ================= NO SEARCH RESULT ================= */}



            {reports.length > 0 &&

              filteredReports.length === 0 && (



                <section className="reports-empty">



                  <div className="reports-empty-icon">

                    <FaSearch />

                  </div>





                  <h2>

                    No Matching Records

                  </h2>





                  <p>

                    Try changing your search

                    or status filter.

                  </p>





                  <button

                    type="button"

                    onClick={() => {



                      setSearchTerm("");

                      setStatusFilter("All");



                    }}

                  >



                    Clear Filters



                  </button>



                </section>



              )}





            {/* ================= REPORT HISTORY ================= */}



            {filteredReports.length > 0 && (



              <section className="records-section">





                <div className="records-section-heading">





                  <div>



                    <span>

                      REPORT HISTORY

                    </span>



                    <h2>

                      Emergency Records

                    </h2>



                    <p>

                      Your complete submitted

                      emergency report history.

                    </p>



                  </div>





                  <div className="records-secure">



                    <FaShieldAlt />



                    AUTHENTICATED RECORDS



                  </div>





                </div>





                <div className="records-list">





                  {filteredReports.map(

                    (report, index) => {





                      const isResolved =

                        (report.status || "Pending")

                          .toLowerCase() ===

                        "resolved";





                      return (



                        <article

                          className="record-card"

                          key={report.id}

                        >





                          {/* ================= IMAGE ================= */}



                          <div className="record-image">





                            {report.file_path ? (



                              <a

                                href={getImageUrl(

                                  report.file_path

                                )}

                                target="_blank"

                                rel="noreferrer"

                              >



                                <img

                                  src={getImageUrl(

                                    report.file_path

                                  )}

                                  alt={`Emergency report ${report.id}`}

                                />



                              </a>



                            ) : (



                              <div className="record-no-image">



                                <FaImage />



                                <span>

                                  No Image Available

                                </span>



                              </div>



                            )}





                            <div className="record-index">



                              {String(

                                index + 1

                              ).padStart(

                                2,

                                "0"

                              )}



                            </div>





                            <div className="record-id-overlay">



                              REPORT #{report.id}



                            </div>





                          </div>





                          {/* ================= CONTENT ================= */}



                          <div className="record-content">





                            {/* HEADING */}



                            <div className="record-heading">





                              <div>



                                <span className="record-label">

                                  EMERGENCY RECORD

                                </span>





                                <h2>



                                  <FaHeartbeat />



                                  {report.emergency_type ||

                                    "Emergency"}



                                </h2>



                              </div>





                              <div className="record-badges">





                                {/* STATUS */}



                                <span

                                  className={`record-status ${getStatusClass(

                                    report.status

                                  )}`}

                                >



                                  {isResolved ? (

                                    <FaCheckCircle />

                                  ) : (

                                    <FaClock />

                                  )}



                                  {report.status ||

                                    "Pending"}



                                </span>





                                {/* SEVERITY */}



                                <span

                                  className={`record-severity ${getSeverityClass(

                                    report.severity

                                  )}`}

                                >



                                  {report.severity ||

                                    "Unknown"}{" "}



                                  Severity



                                </span>





                              </div>





                            </div>





                            {/* ================= DETAILS ================= */}



                            <div className="record-details-grid">





                              {/* DATE */}



                              <div className="record-detail">



                                <FaCalendarAlt />





                                <div>



                                  <span>

                                    REPORTED

                                  </span>



                                  <strong>



                                    {formatDate(

                                      report.created_at

                                    )}



                                  </strong>



                                </div>



                              </div>





                              {/* LOCATION */}



                              <div className="record-detail">



                                <FaMapMarkerAlt />





                                <div>



                                  <span>

                                    LOCATION

                                  </span>



                                  <strong>



                                    {report.address ||

                                      "Address unavailable"}



                                  </strong>



                                </div>



                              </div>





                            </div>





                            {/* ================= AI GUIDANCE ================= */}



                            <div className="record-ai">





                              <div className="record-ai-heading">





                                <div className="record-ai-icon">



                                  <FaRobot />



                                </div>





                                <div>



                                  <span>

                                    SENTINEL AI

                                  </span>



                                  <strong>

                                    Emergency Guidance

                                  </strong>



                                </div>





                              </div>





                              <p>



                                {report.guidance ||

                                  "No AI guidance available."}



                              </p>





                            </div>





                            {/* ================= FOOTER ================= */}



                            <div className="record-footer">





                              {/* RECORD ID */}



                              <div className="record-footer-id">



                                <FaShieldAlt />



                                <span>

                                  Record ID

                                </span>



                                <strong>

                                  #{report.id}

                                </strong>



                              </div>





                              {/* VIEW LOCATION */}



                              {report.latitude &&

                                report.longitude && (



                                  <a

                                    href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}

                                    target="_blank"

                                    rel="noreferrer"

                                    className="record-map-button"

                                  >



                                    <FaMapMarkerAlt />



                                    View Location



                                    <FaExternalLinkAlt />



                                  </a>



                                )}





                              {/* MARK AS RESOLVED */}



                              {!isResolved && (



                                <button

                                  type="button"

                                  className="record-resolve-button"

                                  onClick={() =>

                                    markAsResolved(

                                      report.id

                                    )

                                  }

                                  disabled={

                                    updatingReportId ===

                                    report.id

                                  }

                                >



                                  {updatingReportId ===

                                  report.id ? (



                                    <>



                                      <FaSyncAlt

                                        className="resolve-spinner"

                                      />



                                      Updating...



                                    </>



                                  ) : (



                                    <>



                                      <FaCheckCircle />



                                      Mark as Resolved



                                    </>



                                  )}



                                </button>



                              )}





                            </div>





                          </div>





                        </article>



                      );



                    }

                  )}





                </div>





              </section>



            )}





          </>



        )}





      </div>





    </main>



  );



}





export default Reports;