$(document).ready(function() {
    document.getElementById('image').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imagePreview = document.getElementById('image_preview');
                imagePreview.innerHTML = '<img src="' + e.target.result + '" alt="Selected Image" style="max-width: 100%; height: auto;">';
            }
            reader.readAsDataURL(file);
        }
    });

    $("#save").on("click", function (){
        const key = Date.now().toString(); // 一意のキーを生成
        const imageElement = document.getElementById('image');
        const imageFile = imageElement.files[0];
        let uploadedFileUrl = "";

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedFileUrl = e.target.result;

                const value = {
                    regiDate: $("#regiDate").val(),
                    place: $("#place").val(),
                    reason: $("#reason").val(),
                    image: uploadedFileUrl
                };

                localStorage.setItem(key, JSON.stringify(value));
                appendTaskToPriorityList(key, value);

                $("#regiDate").val("");
                $("#pl").val("");
                $("#reason").val("");
                $("#image").val("");
                $("#image_preview").html("");
            }
            reader.readAsDataURL(imageFile);
        } else {
            const value = {
                regiDate: $("#regiDate").val(),
                place: $("#place").val(),
                reason: $("#reason").val(),
                image: ""
            };

            localStorage.setItem(key, JSON.stringify(value));
            appendTaskToPriorityList(key, value);

            $("#regiDate").val("");
            $("#place").val("");
            $("#reason").val("");
            $("#image").val("");
            $("#image_preview").html("");
        }
    });

    function appendTaskToPriorityList(key, value) {
        const html =`
        <li class="pj-box" data-key="${key}">
            <p>登録日: ${value.regiDate}</p>
            <p>おすすめスポット名: ${value.place}</p>
            <p>おすすめポイント: ${value.reason}</p>
            ${value.image ? `<img src="${value.image}" alt="Uploaded Image">` : ''}
            <button class="finish-btn">削除</button>
        </li>
        `;

        $("#list").append(html);

        $(".finish-btn").off("click").on("click", function() {
            const parent = $(this).closest(".pj-box");
            const key = parent.data("key");
            localStorage.removeItem(key);
            parent.remove();
        });
    }

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = JSON.parse(localStorage.getItem(key));
        appendTaskToPriorityList(key, value);
    }
});

let map;

function initMap() {
    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const location = { lat, lng: lon };

            map = new google.maps.Map(document.getElementById("map"), {
                center: location,
                zoom: 15
            });

            const customIcon = {
                url: 'image/light-bulb.png', // カスタムアイコンのURLを指定
                scaledSize: new google.maps.Size(50, 50), // アイコンのサイズを指定
                origin: new google.maps.Point(0, 0), // アイコンの起点
                anchor: new google.maps.Point(25, 50) // アンカーの位置
            };

            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: "現在地",
                icon: customIcon // カスタムアイコンを指定
            });

            const infowindow = new google.maps.InfoWindow({
                content: "お気に入りの場所"
            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        },
        error => {
            console.error("Error Code = " + error.code + " - " + error.message);
        }
    );
}