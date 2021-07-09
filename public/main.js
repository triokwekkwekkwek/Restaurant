const update = document.querySelector('#update-button')

// function submitEdit(val, menu_name) {
//   update.addEventListener('click', _ => {
//     fetch('/menu', {
//         method: 'put',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             nama: menu_name,
//             deskripsi: document.getElementById("update-deskripsi_" + val),
//             harga: document.getElementById("update-harga_" + val)
//         })
//     })
//   })
// }

$('button').each(function() {
  $(this).on('click', function() {
    if($(this).attr("id") === "edit-button") {
      editMenu($(this).attr("data-ref"));
    }
    else if ($(this).attr("id") === "delete-button") {
      deleteMenu($(this).attr("data-name"));
    }
    else if ($(this).attr("id") === "increment-button") {
      increment($(this).attr("data-ref"));
    }
    else if ($(this).attr("id") === "decrement-button") {
      decrement($(this).attr("data-ref"));
    }
    else if ($(this).attr("id") === "order-button") {
      combineAndSendForms();
    }
    else if ($(this).attr("id") === "after-submit-alias-button") {
      goToPemesanan($(this).attr("data-ref"));
    }
    else if ($(this).attr("id") === "add-review-button") {
      addReview($(this).attr("data-ref"));
    }
  })
});

function editMenu(val) {
    var x = document.getElementById("input-form_" + val);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}

function addReview(val) {
  var x = document.getElementById("review-form_" + val);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function deleteMenu(val) {
  fetch('/menu', {
    method:'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nama: val
    })
  })
}

function increment(val) {
  document.getElementById('demoInput_' + val).stepUp();
}

function decrement(val) {
  document.getElementById('demoInput_' + val).stepDown();
}

function combineAndSendForms() {
  var form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", "/pemesanan");

  var button = document.createElement("button");
  button.setAttribute("type", "submit")
  button.setAttribute("value", "submit")

  form.setAttribute("type", "submit")
  form.appendChild(button)

  // var $newForm = $("<form></form>")    
  //     .attr({method : "POST", action : "/pemesanan"}) 
  // ;
  var inputs = document.querySelectorAll('input');
  var i;

  for(i = 0; i < inputs.length; i++) {
    var value = inputs[i].value;
    // var name = inputs[key]

    // console.log(inputs[key].getAttribute('data-name'))
    // console.log(inputs[key].value)
    
    if(value > 0) {
      // form.appendChild(inputs[i]);
      form.append($("<input type=\"hidden\" />")   
            .attr(inputs[i].getAttribute('data-name'), this.name)  
            .value($(this).value()));   
    }
  }
  document.body.appendChild(form);

  // console.log(filled);
  
  // $(":input:not(:submit, :button)").each(function() {  // grab all the useful inputs
  //     if($(this).value() != 0) {
  //         $newForm.append($("<input type=\"hidden\" />")   // create a new hidden field
  //           .attr('data-name', this.name)   // with the same name (watch out for duplicates!)
  //           .value($(this).value())        // and the same value
  //       );
  //     }
  // });
  // $newForm
  //     .appendTo(document.body)  // not sure if this is needed?
  //     .submit()                 // submit the form
  // ;

  console.log(form);
}