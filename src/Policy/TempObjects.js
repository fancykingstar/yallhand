export const stateOptions = [ 
{ key: 'DE', value: 'DE', text: 'Global (All Teams)' },    
{ key: 'AL', value: 'AL', text: 'Alabama' }, 
{ key: 'MA', value: 'MA', text: 'Massachusetts (including subteams)' },
{ key: 'BO', value: 'BOS', text: 'Boston', flag:'00', description:'Last Updated 5.23.17'},
{ key: 'WO', value: 'WOS', text: 'Worcester', flag:'00' },
{ key: 'KL', value: 'KL', text: 'San Jose, San Francisco, Los Angeles', description:'Last Updated 5.23.17', label:{ color: 'red', empty: true, circular: true } },  ]

export const tagOptions = [
    { key: 'angular', text: 'Manager', value: 'angular'  },
    { key: 'css', text: 'Warehouse', value: 'css' },
    { key: 'design', text: 'Consulting', value: 'design' }]

export const teamOptions = [ 
        { key: 'DE', value: 'DE', text: 'Global (All Teams) [Tags: Warehouse, Manager]', description: 'Updated 5.23.17' },    
        { key: 'AL', value: 'AL', text: 'Alabama' }, 
        { key: 'MA', value: 'MA', text: 'Massachusetts (including subteams)' },
        { key: 'BO', value: 'BOS', text: 'Boston', flag:'00'},
        { key: 'WO', value: 'WOS', text: 'Worcester', flag:'00' }  ]

export const resourceLinks = [
    {   key: '1RL', url: 'https://www.example.com/place/wherethingsare', label: 'A first example of something' },
    { key: '2RL', url: 'https://www.anotherexample.com/place/wherethingsare', label: 'A good second example of something' }
]

export const conditions = [
    {   key: '1Cond', label: 'if one thing' },
    { key: '2Cond', label: 'if another thing' },
    { key: '3Cond', label: 'more' }
]

export const attached = [
    { key: '1Att', label: 'fileone.pdf', url: 'https://www.filestoredherebro.com', date: '5.17.17'},
    { key: '2Att', label: 'filetwo.pdf', url: 'https://www.filestoredherebro.com',  date: '5.17.17'},
    { key: '3Att', label: 'filethree.pdf', url: 'https://www.filestoredherebro.com',  date: '5.17.17'}
]

export const automations = [
    { key: '1auto', value: '1auto', text: 'Contact HR for meeting', description: 'email: hr@company (public' },   
    { key: '2auto', value: '2auto', text: 'Anonymous reporting', description: 'Anonynmous > Email hr@company.com' },   
    { key: '3auto', value: '3auto', text: 'Report damage to IT', description: 'Contacts > Email it@company.com' }   
]