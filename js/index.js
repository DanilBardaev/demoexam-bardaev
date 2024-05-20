  const infoItems = document.querySelectorAll('#info-list ul li');


  infoItems.forEach(item => {
    item.addEventListener('click', () => {
    
      infoItems.forEach(item => {
        item.classList.remove('active-info');
      });

   
      item.classList.add('active-info');

    
      const infoId = item.getAttribute('data-info');
    
      document.querySelectorAll('.info-item').forEach(info => {
        info.classList.remove('active-info');
      });
      document.getElementById(infoId).classList.add('active-info');
    });
  });

  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("navbarDropdown").addEventListener("click", function() {
      var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
        keyboard: false
      });
      myModal.show();
    });
  });

  $(document).ready(function(){
 
    $('.modal-link').click(function(e){
      e.preventDefault();
      var url = $(this).attr('href');
      window.open(url, '_blank');
    });
  });
