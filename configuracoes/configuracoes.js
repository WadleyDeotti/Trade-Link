document.addEventListener('DOMContentLoaded', function() {
    
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            
            this.classList.add('active');
            
            
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    
    document.querySelector('.sidebar-item[data-target="conta"]').click();
    
    
    const changePicBtn = document.querySelector('.change-pic-btn');
    if (changePicBtn) {
        changePicBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            alert('Funcionalidade de alterar foto será implementada aqui');
        });
    }
    
    
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            alert('Configurações salvas com sucesso!');
        });
    }
});