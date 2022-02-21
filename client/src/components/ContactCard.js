
function ContactCard({contact}){

    return (
        <div className="chat_card">
            <h2>{contact.username}</h2>
            <h4 style={{color: 'rgba(255, 255, 255, 0.5)'}}>{contact.email}</h4>
        </div>
    );
}

export default ContactCard;