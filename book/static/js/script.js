window.addEventListener("DOMContentLoaded", (event) => {

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    let csrftoken = getCookie('csrftoken');
    let activeItem = null
    let list_snapshot = []

    buildList()

    function buildList(search_data=null, pagination_url=null){
        let wrapper = document.getElementById('list-wrapper')
        let url = 'http://127.0.0.1:8000/api/contact_list/'

        if (pagination_url) {
            url = pagination_url
        }

        send_data = {
            method:'GET',
            }
        if (search_data) {
            url = 'http://127.0.0.1:8000/api/contact_search/'
            send_data = {
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'X-CSRFToken':csrftoken,
                },
                body:JSON.stringify({search_data})
            }
        }

        fetch(url, send_data)
        .then((resp) => resp.json())
        .then(function(data){
            let paginator_block = document.getElementById('pagination')
            let list = []
            let error = 'Log In to use API'

            if (search_data) {
                wrapper.innerHTML = ''
                paginator_block.innerHTML = ''
                list = data
                if (data.length == 0) {
                    error = `Error: can't find any contact.`
                }
            } else {
                list = data['results']
            }

            if (search_data === null) {
                // let pagination = document.getElementById('pagination')
                paginator_block.innerHTML = `
                <span class="pag" id="prev_page">Privious</span>
                    <span class="pag" id="next_page">Next</span>`
    
                let prev_page = document.getElementById('prev_page')
                let next_page = document.getElementById('next_page')
    
                
                prev_page.addEventListener('click', function(pagination_url){
                    return function(){
                        buildList(null, pagination_url=pagination_url)
                    }
                }(data['previous']))
    
                next_page.addEventListener('click', function(pagination_url){
                    return function(){
                        buildList(null, pagination_url)
                    }
                }(data['next']))
    
                if (data['previous'] === null) {
                    prev_page.classList.add('hide')
                } else {
                    prev_page.classList.remove('hide')
                }
    
                if (data['next'] === null) {
                    next_page.classList.add('hide')
                } else {
                    next_page.classList.remove('hide')
                }
            }

            for (let i in list){
                try{
                    document.getElementById(`data-row-${i}`).remove()
                }catch(err){}
        
                let contact = `<span class="title">ID: ${list[i].id} First Name: ${list[i].first_name}, Last Name: ${list[i].last_name}, Phone: ${list[i].phone}, Email:${list[i].email}</span>`

                let item = `
                    <div id="data-row-${i}" class="contact_wrapper flex-wrapper">
                        <div style="flex:7">
                            ${contact}
                        </div>
                        <div style="flex:1">
                            <button class="btn btn-sm btn-outline-info edit">Edit</button>
                        </div>
                        <div style="flex:1">
                            <button class="btn btn-sm btn-outline-danger delete">Del</button>
                        </div>
                    </div>
                `
                wrapper.innerHTML += item
            }
            
            if (list.length == 0) {
                wrapper.innerHTML = error
            }

            if (list_snapshot.length > list.length){
                for (let i = list.length; i < list_snapshot.length; i++){
                    document.getElementById(`data-row-${i}`).remove()
                }
            }

            list_snapshot = list

            for (let i in list){
                let editBtn = document.getElementsByClassName('edit')[i]
                let deleteBtn = document.getElementsByClassName('delete')[i]
                let title = document.getElementsByClassName('title')[i]

                editBtn.addEventListener('click', (() => {
                    let item = list[i]
                    return () => {
                        editItem(item)
                    }
                })())


                deleteBtn.addEventListener('click', (function(item){
                    return function(){
                        deleteItem(item)
                    }
                })(list[i]))
            }
        })
    }


    let form = document.getElementById('form-wrapper')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        let url = null

        if (activeItem != null){
            url = `http://127.0.0.1:8000/api/contact_update/${activeItem.id}/`
            activeItem = null
        } else {
            url = 'http://127.0.0.1:8000/api/contact_create/'
        }

        let first_name = document.getElementById('first_name').value
        let last_name = document.getElementById('last_name').value
        let phone = document.getElementById('phone').value
        let email = document.getElementById('email').value

        let json_data = JSON.stringify({
            'first_name':first_name,
            'last_name':last_name,
            'phone':phone,
            'email':email,
        })

        fetch(url, {
            method:'POST',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            },
            body:JSON.stringify({json_data})
        }).then(function(response){
            buildList()
            document.getElementById('form').reset()
        })
    })




    function editItem(item){
        activeItem = item
        document.getElementById('first_name').value = activeItem.first_name
        document.getElementById('last_name').value = activeItem.last_name
        document.getElementById('phone').value = activeItem.phone
        document.getElementById('email').value = activeItem.email
    }


    function deleteItem(item){
        fetch(`http://127.0.0.1:8000/api/contact_delete/${item.id}/`, {
            method:'DELETE', 
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
            }
        }).then((response) => {
            buildList()
        })
    }


    let search_block = document.getElementById('search')
    search_block.addEventListener('submit', (e) => {
        e.preventDefault()
        
        let json_data = ''
        let search_id = document.getElementById('search_id').value
        let search_first_name = document.getElementById('search_first_name').value
        let search_last_name = document.getElementById('search_last_name').value
        let search_phone = document.getElementById('search_phone').value
        let search_email = document.getElementById('search_email').value

        if (search_id) {
            json_data = JSON.stringify({
                'search_id':search_id,
                'search_first_name':'',
                'search_last_name':'',
                'search_phone':'',
                'search_email':'',
            })

        } else {
            json_data = JSON.stringify({
                'search_id':'',
                'search_first_name':search_first_name,
                'search_last_name':search_last_name,
                'search_phone':search_phone,
                'search_email':search_email,
            })
        }

        buildList(json_data)
    })

    search_id.addEventListener("input", function () {
        search_first_name.disabled = this.value != "";
        search_last_name.disabled = this.value != "";
        search_phone.disabled = this.value != "";
        search_email.disabled = this.value != "";
    });

    let refresh_button = document.getElementById('refresh_button')
    refresh_button.addEventListener('click', (e) => {
        e.preventDefault()
        location.reload()
    })

})