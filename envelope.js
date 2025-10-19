// envelope.js — fixed spacing + black text letter + transparent floating background
(function () {
  const Z = 10050;
  const STYLE_ID = "css-envelope-style";
  const MOUNT_ID = "css-envelope-mount";
  const OVERLAY_ID = "letterOverlay";

  function injectStyleOnce() {
    if (document.getElementById(STYLE_ID)) return;
    const css = `
:root{
  --env:#F3A8C6; --env2:#E98AB1; --flap:#E277A3;
  --w:clamp(320px,44vmin,520px); --h:calc(var(--w)*0.62);
  --br:10px;
}
#${MOUNT_ID}{
  position:fixed; inset:0; z-index:${Z};
  background:transparent; /* was #000 — this was hiding the fireworks */
  display:none;
  align-items:center; justify-content:center;
  font-family:"Garamond Premier", Garamond, serif;
}

#${MOUNT_ID}.show{ display:flex; }

#envelope{
  position:relative; width:var(--w); height:var(--h);
  background:var(--flap);
  border-bottom-left-radius:var(--br);
  border-bottom-right-radius:var(--br);
  box-shadow:0 8px 32px rgba(0,0,0,.35);
  cursor:pointer;
}
.front{ position:absolute; width:0; height:0; z-index:3; pointer-events:none; }
.flap{
  border-left:calc(var(--w)/2) solid transparent;
  border-right:calc(var(--w)/2) solid transparent;
  border-bottom:calc(var(--h)/2 - 10px) solid transparent;
  border-top:calc(var(--h)/2 + 10px) solid var(--flap);
  transform-origin:top;
  transform:rotateX(0deg);
  transition:transform .45s ease;
}
.pocket{
  border-left:calc(var(--w)/2) solid var(--env);
  border-right:calc(var(--w)/2) solid var(--env);
  border-bottom:calc(var(--h)/2) solid var(--env2);
  border-top:calc(var(--h)/2) solid transparent;
  border-bottom-left-radius:var(--br);
  border-bottom-right-radius:var(--br);
}

.letter{
  position:relative;
  width:92%; height:90%;
  margin:0 auto; top:5%;
  background:#fff; border-radius:var(--br);
  box-shadow:0 2px 26px rgba(0,0,0,.12);
  transition:opacity .3s ease, transform .45s ease .4s;
}
#envelope.open .flap{ transform:rotateX(180deg); }
#envelope.open .letter{ transform:translateY(calc(-1 * var(--h) / 3)); opacity:0; }

/* floating letter overlay */
#${OVERLAY_ID}{
  position:fixed; inset:0; z-index:${Z+2};
  display:none; align-items:center; justify-content:center;
  pointer-events:none;
}
#${OVERLAY_ID}.show{ display:flex; animation:floatUp 1.6s ease forwards; }
@keyframes floatUp{
  0%{ transform:translateY(80px) scale(.85); opacity:0; }
  100%{ transform:translateY(-10px) scale(1); opacity:1; }
}
.letter-page{
  background:rgba(255, 255, 255, 0.80); /* transparent 20% */
  color:#000;                      /* black text */
  width:min(80vw,680px);
  padding:44px 54px;
  border-radius:var(--br);
  box-shadow:0 0 30px rgba(243,168,198,0.55);
  backdrop-filter:blur(10px);
  -webkit-backdrop-filter:blur(10px);
  font-family:"Garamond Premier", Garamond, serif;
  font-size:clamp(18px,2.2vmin,24px);
  line-height:1.6;
  white-space:pre-wrap; /* keep spaces + line breaks */
  text-shadow:none;
  overflow:hidden;
}

/* typing animation */
.letter-page span{
  opacity:0; display:inline;
  animation:fadeIn .045s forwards;
}
@keyframes fadeIn{ to{ opacity:1; } }
`;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildDOMOnce() {
    if (document.getElementById(MOUNT_ID)) return;
    const mount = document.createElement("div");
    mount.id = MOUNT_ID;
    mount.innerHTML = `
      <div id="envelope" class="close">
        <div class="front flap"></div>
        <div class="front pocket"></div>
        <div class="letter"></div>
      </div>
      <div id="${OVERLAY_ID}">
        <div class="letter-page"></div>
      </div>
    `;
    document.body.appendChild(mount);

    const envelope   = mount.querySelector("#envelope");
    const innerPaper = mount.querySelector(".letter");
    const overlay    = mount.querySelector("#" + OVERLAY_ID);
    const page       = overlay.querySelector(".letter-page");

    // ✨ your message (now spaced correctly)
    const message = `
Dear các chị/các bạn/các em team mô hình rủi ro và chỉ số basel,

Vì bị chê chữ xấu nên em xin phép được code thay vì viết lời thiệp này. Không chỉ riêng ngày 20/10, mà mong rằng mọi ngày trong năm đều là ngày đặc biệt dành cho chị em. Xin gửi các chị em vài câu vè nhỏ, chúc mọi người lúc nào cũng rạng rỡ như hoa và hạnh phúc như ý. Chúc các chị em 

  Đầu không rụng tóc 
  Đêm không mất ngủ 
  Ví luôn no đủ 
  Tiền tự tìm sang

  Nhà luôn ấm áp
  Tình chẳng tàn phai
  Sự nghiệp nối dài
  Môi cười tươi mãi 🎀🫶🏻💌💓

– Quang.vn3
`;

    function typeText(text, target) {
      target.textContent = "";
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement("span");
        span.textContent = text[i];
        span.style.animationDelay = i * 0.01 + "s";
        target.appendChild(span);
      }
    }

    function showOverlay() {
      overlay.classList.add("show");
      typeText(message, page);
    }

    function openEnvelope() {
      if (envelope.classList.contains("open")) return;
      envelope.classList.add("open");
      envelope.classList.remove("close");
      setTimeout(() => {
        innerPaper.style.display = "none";
        showOverlay();
      }, 900);
    }

    envelope.addEventListener("click", openEnvelope);
  }

  window.showEnvelope3D = function () {
    injectStyleOnce();
    buildDOMOnce();
    document.getElementById(MOUNT_ID).classList.add("show");
  };
})();
