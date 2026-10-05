const { createApp } = Vue;

const app = createApp({
    data: () => ({
        user: data.user,
        contacts: data.contacts,
        activeId: 1
    }),
    computed: {
        // contatto attualmente selezionato
        activeContact() {
            return this.contacts.find(contact => contact.id === this.activeId);
        },
        // data dell'ultimo messaggio ricevuto dal contatto attivo
        lastMessageDate() {
            const received = this.activeContact.messages.filter(message => message.status === 'received');
            if (!received.length) return '';
            return received[received.length - 1].date;
        }
    },
    methods: {
        getAvatarUrl(avatar) {
            return `img/avatar${avatar}.jpg`;
        },
        // dalla data 'gg/mm/aaaa hh:mm:ss' ricavo solo 'hh:mm'
        getTime(date) {
            if (!date) return '';
            return date.split(' ')[1].slice(0, 5);
        },
        getLastMessage(contact) {
            const { messages } = contact;
            if (!messages.length) return '';
            return messages[messages.length - 1].text;
        },
        setActiveContact(id) {
            this.activeId = id;
        }
    }
});

app.mount('#root');
