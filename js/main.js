


$(document).ready(function(){
 
  
  var next_step;
  var current_step;

  //! variabile a cui assegnare il tipo di utente
  var type_user; 

  //! timer della pagina a cui assegno un setInterval
  var myTimer;

  //! variabile in cui salvo le pagine clonate
  var clone_step;
  var sismicIntervention={};

  //! variabili delle progress bar
  var steps
  var current = 1;
  
  var seismicValutationObj;
  
  var resultObj={}
  
  $.getScript( "js/validation.js", function( data ) {
  });
   
  $.ajax({
    type: "GET",
    url: "../data/classificazione-sismica-2020.csv",
    
    success: function (response) {
      seismicValutationObj= $.csv.toObjects(response);
      
    }
  });

 /*  function saveData(countPage){
    let field=$(`fieldset[data-count-page=${countPage}] .save-data`).get();
    var arr = [];
    field.forEach((el)=>{
      let type=el.getAttribute('type')
      if(el.classList.contains('group-save')){
        let groupKey=el.getAttribute('data-group-result');
        
        if(!arr.includes(groupKey)){
          arr.push(groupKey)
        }
      } else if(el.classList.contains('select-control')){
        console.log(el);
        let name = el.getAttribute('name');
        let val = el.options[el.selectedIndex].text;
        console.log(name);
        console.log(val);
        resultObj[name]=val

      } else if(type=='text' || type=='number' || type=='date') {
      
        let name=el.getAttribute('name');
        let val=el.value;
        
        resultObj[name]=val
      } else if(type=='checkbox'){
        if (el.checked){
          let name = el.getAttribute('name');
          resultObj[name]=true
        } else {
          let name = el.getAttribute('name');
          resultObj[name]=false
        }
      } 

    })
    
    if (arr.length){
      for(let i=0; i<arr.length;i++){
        let groupKey = arr[i];
        var elements={};
        

        let inputs=$(`fieldset[data-count-page=${countPage}] .save-data[data-group-result=${groupKey}]`).get();

        inputs.forEach((el)=>{
          if (el.classList.contains('select-control')){
            let name=el.getAttribute('name');
            let val = el.options[el.selectedIndex].text;
            elements[name]=val
          } else {
            let name=el.getAttribute('name');
            let val=el.value;
            elements[name]=val
          }
          
        })
        resultObj[groupKey]=elements
        
      }
    }
  } */
  function saveData(countPage){
    let commonField=$(`fieldset[data-count-page=${countPage}] .save-data`).get();
    let arrField=$(`fieldset[data-count-page=${countPage}] .save-data-array`).get();
    let ecobonus = {}
    var arr = [];
    var arrModal={};
    commonField.forEach((el)=>{
      let type = el.getAttribute('type')
      if(el.getAttribute('type')=='checkbox'){
        let name=el.getAttribute('name');
        let val= el.checked ? true : false 
        resultObj[name]=val  
      } else {
        let name=el.getAttribute('name');
        let val=el.value;
        resultObj[name]=val;
      }
    })
    
    if(arrField.length){
      arrField.forEach(el => {
        if(el.classList.contains('select-control')){
          let name = el.getAttribute('name');
          let val = el.options[el.selectedIndex].text;
          
          
          ecobonus[name]={ "name" : val}
  
        } else if(el.classList.contains('group-save')){
          let name = el.getAttribute('name');
          let groupKey=el.getAttribute('data-group');
          if (el.classList.contains('from-select')){
            var val = el.value;
            var element={ [name]: {"name" : val} }
          } else {
            let val = el.value;
            var element ={[name] : val}
          }

          if(typeof JSON.stringify(ecobonus[groupKey]) ==='undefined'){
            ecobonus[groupKey]= element
          } else {
            $.extend(ecobonus[groupKey], element)
          }       
        
          
        } else if(el.classList.contains('group-save-select')){
          let name=el.getAttribute('name');
          let val=el.options[el.selectedIndex].text;
          
          let groupKey=el.getAttribute('data-group');

          var element={ [name]: {"name" : val} }
          if(typeof JSON.stringify(ecobonus[groupKey]) ==='undefined'){
            ecobonus[groupKey]= element
            console.log(ecobonus[groupKey]);
          } else {
            $.extend(ecobonus[groupKey], element)
            console.log(ecobonus[groupKey]);
          }   

          
        } else {
        
          let name=el.getAttribute('name');
          let val=el.value;
          
          ecobonus[name]=val
        }
      });
    }
   
    if (isObjectDefined(ecobonus)){
      if(typeof JSON.stringify(resultObj["bonus110"]) ==='undefined'){
        arr.push(ecobonus);
        resultObj["bonus110"]=arr;
        console.log(ecobonus);
      } else {
        console.log(ecobonus);
        let updateArr = resultObj["bonus110"][0];
        console.log(updateArr);
        $.extend(updateArr, ecobonus);
        resultObj["bonus110"]=[updateArr]
        
      }

      
    }
  }

  $('.getValutation').on('click', function(){
    let val=$(this).siblings('input').val()
    let result= $('.result-valutation')
    
    for (let el of seismicValutationObj){
      if(el.Denominazione.toLowerCase()===val.toLowerCase()){
        result.val(el["Classificazione 2020"])
        break
      } else {
        result.val("non abbiamo trovato nessun risultato")
        
      }
    }
  })

  
//todo bisogna assegnare un errore nel caso l'utente prova ad andare avanti senza accettare la privacy
$("#privacy").on("change", function () {
  if ($(this).is(":checked")) {
      let btn_next = $(this)
          .closest(".form-group")
          .siblings(".bottoni")
          .children(".next");
      btn_next.prop("disabled", false);
  } else if ($(this).not(":checked")) {
      let btn_next = $(this)
          .closest(".form-group")
          .siblings(".bottoni")
          .children(".next");
      btn_next.prop("disabled", true);
  }
});

    
  
$(".next").on('click',function(e){
  current_step = $(this).closest('fieldset');
  let fieldset_count_page=$(this).closest("fieldset").attr("data-count-page")
  let control=controlInput(fieldset_count_page);
  
  //if(control){
    
    
    if(fieldset_count_page==10){
      checkSismic(fieldset_count_page)
      
    }
        saveData(fieldset_count_page)
        let result = JSON.stringify(resultObj)
        console.log(result);
        next_step = $(this).closest("fieldset").next();
        current_step.hide();
        next_step.show();
        setProgressBar(++current);
        $(".progress").css("display", "block");
        $(".error").text("");
    //}
});

    $(".previous").on("click", function () {
        current_step = $(this).closest("fieldset");
        next_step = $(this).closest("fieldset").prev();
        next_step.show();
        current_step.hide();
        setProgressBar(--current);
    });

    $(".previous-reg").on("click", function () {
        current_step = $(this).closest("fieldset");
        next_step = $(this).closest("fieldset").prev();
        next_step.show();
        current_step.hide();
        setProgressBar(--current);
        clone_step.forEach((element) => {
            let el_page = element.getAttribute("data-count-page") - 1;
            $("fieldset[data-count-page='" + el_page + "']").after(element);
        });
        
        clone_step = "";
    });
    
    
    
  
    function setProgressBar(curStep){
      steps=$("fieldset").length; 
      var percentuale = parseFloat(100 / steps) * curStep;
      percentuale = percentuale.toFixed();
      $(".progress-bar")
        .css("width",percentuale+"%")

    }

    //! funzione che setta timer
    function setClock(){
      clearInterval(myTimer)
      $(".clock").css("display", "block")
      let timer = 30;
      let clock=$(".clock_second");
      clock.text(timer);

      myTimer=setInterval(function(event){
        timer--;
        if(timer<=9){
          timer = "0" + timer;
        } 
        clock.text(timer)    
        if(timer==0){
          clearInterval(myTimer);
          location.reload();
        }
        
      }, 1000)
    }

    // da richiamare quando metteremo il timer
    function setClock() {
        clearInterval(myTimer);
        $(".clock").css("display", "block");
        let timer = 30;
        let clock = $(".clock_second");
        clock.text(timer);

        myTimer = setInterval(function (event) {
            timer--;
            if (timer <= 9) {
                timer = "0" + timer;
            }
            clock.text(timer);

            if (timer == 0) {
                clearInterval(myTimer);
                location.reload();
            }
        }, 1000);
    }

    //! siamo nel fieldset 2 al momento di scegliere se l'utente è un'impresa o una persona fisica.
    //todo dare la classe type-user ai bottoni che devono essere cliccati dall'utente durante la scelta

    //todo in caso si volesse poi reinserire le pagine rimosse dalla funzione, alla pagina successiva, al bottone per tornare indietro sostituire la classe previous con previous-reg

    $(".type-user").on("click", function () {
        let type = $(this).attr("data-typeUser");
        let current_step = $(this).closest("fieldset");
        //? setta la variabile globale type-user in base alla scelta dell'utente
        type_user = type;

        //? se l'utente è una persona salvo in una variabile i fieldset per i dati dell'impresa e viceversa
        if (type_user === "person") {
            var remove_step = current_step.siblings(".business");
        } else if (type_user === "business") {
            var remove_step = current_step.siblings(".person");
        }
        //? prima li clona con tutti gli handler, trasformando il risultato in un array di elementi, poi li rimuovo dalla pagina
        //*nel caso l'utente torni indietro queste pagine verrano reinserite nel DOM, vedere l'handler legato al click sull'elemento con classe previous-reg
        clone_step = remove_step.clone(true).get();
        remove_step.remove();

        //? applica la stessa logica del next, andando alla pagina successiva, settando il timer, aumentando la barra di progresso
        current_step.hide();
        current_step.next().show();
        //setClock();
        setProgressBar(++current);
    });

    //! questa è una funzione provvisoria per nascondere o mostrare il fieldset 10 in base alla scelta dell'utente nella precedente checkbox
      //* se l'utente checca l'input con classe sismic- intervention-check, la pagina si deve vedere

       function checkSismic(currentStep){
        if($('.sismic-intervention-check').is(':checked')) {
         if(sismicIntervention["removed"]){
          let clone_step=sismicIntervention["clone"]
          console.log(currentStep);
          
          $(`fieldset[data-count-page=${currentStep}]`).after(clone_step);
         }
         
        } else {
          sismicIntervention["removed"]=true
          let remove_step=$('.sismic-intervention').clone(true).get()
          sismicIntervention["clone"]=remove_step[0];
          console.log(sismicIntervention.clone)
          $('.sismic-intervention').remove()         
        }
      }

    

    //!validazione select
    $(".choose-category").on("change", function () {
        let selectedCategory = $(this).val();
        if (selectedCategory !== "none") {
            $(".category-real-estate")
                .siblings(".bottoni")
                .find(".next")
                .prop("disabled", false);
        } else {
            $(".category-real-estate")
                .siblings(".bottoni")
                .find(".next")
                .prop("disabled", true);
        }
        $(".sub-category").removeClass("active");
        $(".sub-category select").removeClass("group-save-select save-data-array");
        
        $(".category-" + selectedCategory).addClass("active ");
        $(".category-" + selectedCategory + " select").addClass("group-save-select save-data-array");
    })    
    //! validazioni checkbox*/
    $(".owner-title input").on("click", function () {
        $(".owner-title input").prop("checked", false);
        $(this).prop("checked", true);
        $(".owner-title")
            .siblings(".bottoni")
            .find(".next")
            .prop("disabled", false);
    });

    $(".category-user input").on("click", function () {
        $(".category-user input").prop("checked", false);
        $(this).prop("checked", true);
        $(".category-user")
            .siblings(".bottoni")
            .find(".next")
            .prop("disabled", false);
    });

    $(".intervention-trainant input").on("click", function () {
        if ($(".none-check").is(":checked") && $(this).hasClass("none-check")) {
            $(".intervention-trainant input").prop("checked", false);
            $(".none-check").prop("checked", true);
        } else if (
            $(".none-check").is(":checked") &&
            !$(this).hasClass("none-check")
        ) {
            $(".none-check").prop("checked", false);
        }
        if ($(".intervention-trainant input:checked").length) {
            $(".intervention-trainant")
                .siblings(".bottoni")
                .find(".next")
                .prop("disabled", false);
        } else {
            $(".intervention-trainant")
                .siblings(".bottoni")
                .find(".next")
                .prop("disabled", true);
        }
    });

    //! funzione di controllo per validare gli input e le select in pagina
      //todo dare classe input-control agli input che devono essere controllati, e classe select-control alle select che devono essere controllate

      //todo l'errorBox deve essere fratello di row-input, il label figlio diretto di row-input

      //todo per dirgli che c'è un errore impostare la variabile emptyInput a true
              //!! la funzione ritorna falso, se c'è qualcosa che non va con gli input, e true se è tutto apposto
      function controlInput(countPage){
        //? seleziono il fieldset padre tramite il countPage passato 
        let inputs = $(`fieldset[data-count-page=${countPage}] .input-control`).get()
        let select=$(`fieldset[data-count-page=${countPage}] .select-control`).get()
        let emptyInput=false
        //? controllo gli input all'interno del fieldset 
        inputs.forEach(element => {
          let inputId=element.getAttribute('id')
          let validate=validator.element(`#${inputId}`)
          
          if (!validate){
            emptyInput=true
          }
        })
        select.forEach(element => {
          let selectId=element.getAttribute('id')
          let validate = validator.element(`#${selectId}`)
          
          if(!validate){
            emptyInput=true
          }
         
        });
        if (emptyInput) {
            return false;
        }
        return true;
    }

    function saveInput(){

    }
    
 

    //!funzione per inserire automaticamente i dati dei pop up negli input
      //? dare classe save-pop-up al bottone salva
      //? settare negli input in pagina il data-receive-from uguale all'id dell'input nel pop up di cui salvare i dati
    $(".save-pop-up").on('click', function(e){
      let pop_up=$(this).closest('.modal').attr('id');
      let inputs=$(this).closest('.modal').find('.popup-control').get()
      let selects=$(this).closest('.modal').find('.select-control').get()
      let emptyInput=false
      inputs.forEach(element => {
        let inputId=element.getAttribute('id')
        let validate=validator.element(`#${inputId}`)
        
        if(!validate){
          emptyInput=true
        }
      })
      selects.forEach(element=>{
        let selectId=element.getAttribute('id')
        let validate = validator.element(`#${selectId}`)
        if(!validate){
          console.log($(`#${selectId}`).val());
          emptyInput=true
        }
      })

      if(!emptyInput){
        $(this).closest('.modal').find('.close').click()
        let fieldset_count_page=$(this).closest("fieldset").attr("data-count-page")
        let pop_up_input =$(this).closest('.modal').find('input').get();
        for(let i=0; i<pop_up_input.length; i++){
          let id_pop_up_input=pop_up_input[i].getAttribute('id');
          
          if($(`fieldset[data-count-page=${fieldset_count_page}] input[data-receive-from=${id_pop_up_input}]`).length){
            
            let inputText=pop_up_input[i].value;
            let inputValue=pop_up_input[i].getAttribute('data-value-select')
            
            $(`input[data-receive-from=${id_pop_up_input}`).val(inputText)
            $(`input[data-receive-from=${id_pop_up_input}`).attr('data-value-select', inputValue )
            
           
          }
        }
      }
    })

    $('#coat').on('change', function(){
      if ($(this).is(':checked')){
        $('#coat_input').val('true')
      } else {
        $('#coat_input').val('false')
      }

      console.log($('#coat_input').val());
    })

    $('.save-address').on('click',function(){
      
        let selector = $(this).data('save');
        let address=$(`#route_${selector}`).val();
        let streetNumber=$(`#street_number_${selector} `).val();
        let city=$(`#locality_${selector} `).val();
        let postal_code=$(`#postal_code_${selector} `).val();
      
      $(`#address_${selector}`).val(`${address} ${streetNumber} ${city} ${postal_code} `)
    })
    //! funzione che scrive il valore della option selezionata all'interno dei pop-up, in input nascosti su cui poi fare i dovuti controlli
    //?dare classe send-val alla select
    //? dare lo stesso id delle select all'input, aggiungendo "-input"
    $(".send-val").on("change", function () {
        $(this).siblings(".error").text("");
        let textSelect = $(this).find("option:selected").text();
        let valSelect = $(this).find("option:selected").val();
        let idSelect = $(this).attr("id");
        let hiddenInput = $(`#${idSelect}-input`).get();
        hiddenInput[0].value = textSelect;
        hiddenInput[0].setAttribute('data-value-select', valSelect)
    });

  //! funzione per inserire e pulire input del nome
  $(".send-val-name").on("keyup", function () {
    let valName = $("#name-popup").val();
    let valSurname = $("#surname-popup").val();
    let name = valName
        .split(" ")
        .filter((i) => i)
        .join(" ");
    let surname = valSurname
        .split(" ")
        .filter((i) => i)
        .join(" ");
    $("#complete-name").val(name + " " + surname);   
  });

  //! validazione dell'input di tipo date
  $('#date').on('change', function(){
    let date = new Date();
    let thisYear = date.getFullYear();
    let errorBox = $(this).siblings('.error');
    let dateArr=$('#date').val().split('-');
    if(dateArr[0]<1900 || dateArr[0]>thisYear){
      errorBox.text('Data di nascita non valida')
    } else {
      errorBox.text('')
    }
  })

  //! fix per i modal su iphone

  $('.open-modal').on('click', function(){
    let modal = $(this).data('modal');
    $(`#${modal}`).modal('show');
    $('body').css('overflow','hidden')
  })

  $('.close').on('click' , function () {
    $('body').css('overflow','auto')
  })
    


  // mostra scelta condominio
  $('#type-real-estate').change(function() {
    console.log($('option').val())
      if ($(this).val() == 'condo') {
        $('.condominium').show();
        $('.condominium-hide').hide()
        $('.toggle-reverse').removeClass('select-control save-data-array')
        $('.toggle-control').addClass('input-control save-data-array');
        
      } else {
        $('.condominium').hide();
        $('.condominium-hide').show()
        $('.toggle-reverse').addClass('select-control save-data-array')
        $('.toggle-control').removeClass('input-control save-data-array');
      }
    });

    function isObjectDefined (Obj) {
      if (Obj === null || typeof Obj !== 'object' ||
        Object.prototype.toString.call(Obj) === '[object Array]') {
        return false
      } else {
        for (var prop in Obj) {
          if (Obj.hasOwnProperty(prop)) {
            return true
          }
        }
        return JSON.stringify(Obj) !== JSON.stringify({})
      }
    }

/* 
    let map;

    function initMap() {
      map = new google.maps.Map(document.getElementById("map-registered-office"), {
        center: { lat: 	0, lng: 0},
        zoom: 1,
      });
    }
    const componentForm = {
      street_number: "short_name",
      route: "long_name",
      locality: "long_name",
      //administrative_area_level_1: "short_name",
      //country: "long_name",
      postal_code: "short_name",
    };
    

    var inputGoogle=document.getElementById('address-registered-office');
    function initAutocomplete(){
      autocomplete = new google.maps.places.Autocomplete(inputGoogle, {types:["geocode"]});
      autocomplete.setFields(["address_components", "geometry"]);
      autocomplete.bindTo("bounds", map);
      autocomplete.addListener("place_changed", function(){
        const place = autocomplete.getPlace();
        
        const marker = new google.maps.Marker({
          map,
          anchorPoint: new google.maps.Point(0, -29),
        });
        console.log(place);
      
        for (const component in componentForm) {
          document.getElementById(component).value = "";
          document.getElementById(component).disabled = false;
        }
        for (const component of place.address_components) {
          const addressType = component.types[0];
      
          if (componentForm[addressType]) {
            const val = component[componentForm[addressType]];
            document.getElementById(addressType).value = val;
          }
        }
        
        markers = [];
        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }
    
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17); // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
      });
    }

   
    function geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy,
          });
          autocomplete.setBounds(circle.getBounds());
        });
      }
    }


    initMap()
    initAutocomplete() */
  });

  // google maps autocomplete
