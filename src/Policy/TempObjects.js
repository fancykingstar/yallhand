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
        