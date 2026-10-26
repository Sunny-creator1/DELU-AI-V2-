export default function ContactPage() {
  return (
    <main className="page-shell">
      <div className="container two-col">
        <div className="panel-box">
          <div className="page-header">
            <div className="kicker">CONTACT</div>
            <h1>Talk to DELU HQ</h1>
          </div>
          <p>For support and general enquiries, use the customer support centre or email the business directly.</p>
          <ul>
            <li>Email: deluhq.official@gmail.com</li>
            <li>Hours: Monday to Saturday</li>
          </ul>
        </div>

        <div className="panel-box">
          <div className="page-header">
            <div className="kicker">FAST RESPONSE</div>
            <h2>Send an enquiry</h2>
          </div>
          <form className="form">
            <div className="field"><label>Name</label><input defaultValue="Your name" /></div>
            <div className="field"><label>Email</label><input defaultValue="you@example.com" /></div>
            <div className="field"><label>Message</label><textarea rows={5} defaultValue="How can DELU HQ help?" /></div>
            <button type="button" className="btn">Send message</button>
          </form>
        </div>
      </div>
    </main>
  );
}
