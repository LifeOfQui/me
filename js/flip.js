const areas = document.querySelectorAll('.area');

areas.forEach((area) =>
    area.addEventListener('click', function () {
        var img = this.getElementsByTagName('img');
        img[0].classList.toggle('active');
    })
);
