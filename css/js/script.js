(function () {
  'use strict';

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header com sombra ao rolar ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeMenu() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });
  }

  /* ---------- Scroll suave com compensação do header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- Animação de entrada ---------- */
  var revealTargets = document.querySelectorAll(
    '.section__head, .card, .gallery__item, .testimonial, .about__content, .about__visual, .contact__intro, .form, .accordion__item'
  );

  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Filtro da galeria ---------- */
  var filters = document.querySelectorAll('.filter');
  var items = document.querySelectorAll('.gallery__item');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      var cat = btn.dataset.filter;

      items.forEach(function (item) {
        var match = cat === 'todos' || item.dataset.cat === cat;
        item.classList.toggle('is-hidden', !match);
        item.classList.remove('is-in');
        if (match) {
          // reinicia a animação
          void item.offsetWidth;
          item.classList.add('is-in');
        }
      });
    });
  });

  /* ---------- Acordeão do FAQ ---------- */
  var triggers = document.querySelectorAll('.accordion__trigger');

  triggers.forEach(function (trigger) {
    var panel = trigger.nextElementSibling;

    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // fecha todos
      triggers.forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
        if (t.nextElementSibling) t.nextElementSibling.style.maxHeight = null;
      });

      if (!isOpen && panel) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Máscara de telefone ---------- */
  var tel = document.getElementById('telefone');

  if (tel) {
    tel.addEventListener('input', function () {
      var digits = this.value.replace(/\D/g, '').slice(0, 11);
      var out = '';

      if (digits.length > 0) out = '(' + digits.slice(0, 2);
      if (digits.length >= 3) out += ') ' + digits.slice(2, 7);
      if (digits.length >= 8) out = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7);

      this.value = out;
    });
  }

  /* ---------- Data mínima = hoje ---------- */
  var dataInput = document.getElementById('data');
  if (dataInput) {
    var hoje = new Date();
    var iso = hoje.toISOString().split('T')[0];
    dataInput.min = iso;
  }

  /* ---------- Validação do formulário ---------- */
  var form = document.getElementById('form');
  var success = document.getElementById('formSuccess');

  function setError(field, message) {
    var wrap = field.closest('.form__row');
    var slot = document.querySelector('[data-error="' + field.name + '"]');
    if (wrap) wrap.classList.toggle('has-error', Boolean(message));
    if (slot) slot.textContent = message || '';
  }

  function validate() {
    var valid = true;

    var nome = form.nome;
    if (nome.value.trim().length < 3) {
      setError(nome, 'Informe seu nome completo.');
      valid = false;
    } else setError(nome, '');

    var telefone = form.telefone;
    if (telefone.value.replace(/\D/g, '').length < 10) {
      setError(telefone, 'Informe um WhatsApp válido com DDD.');
      valid = false;
    } else setError(telefone, '');

    var servico = form.servico;
    if (!servico.value) {
      setError(servico, 'Escolha um serviço.');
      valid = false;
    } else setError(servico, '');

    var data = form.data;
    if (!data.value) {
      setError(data, 'Escolha uma data.');
      valid = false;
    } else setError(data, '');

    var horario = form.horario;
    if (!horario.value) {
      setError(horario, 'Escolha um horário.');
      valid = false;
    } else setError(horario, '');

    return valid;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validate()) {
        var firstError = form.querySelector('.has-error input, .has-error select');
        if (firstError) firstError.focus();
        return;
      }

      var nome = form.nome.value.split(' ')[0];
      var servico = form.servico.value.split('—')[0].trim();
      var data = form.data.value.split('-').reverse().join('/');

      if (success) {
        success.hidden = false;
        success.textContent =
          'Pedido enviado, ' + nome + '! Recebemos sua solicitação de ' +
          servico + ' para ' + data + ' às ' + form.horario.value +
          '. Confirmamos pelo WhatsApp em até 2 horas úteis.';
      }

      form.reset();
      document.querySelectorAll('.form__error').forEach(function (s) { s.textContent = ''; });
      document.querySelectorAll('.form__row').forEach(function (r) { r.classList.remove('has-error'); });

      if (success && success.scrollIntoView) {
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // limpa erro ao digitar
    form.querySelectorAll('input, select').forEach(function (field) {
      field.addEventListener('input', function () { setError(field, ''); });
      field.addEventListener('change', function () { setError(field, ''); });
    });
  }
})();
