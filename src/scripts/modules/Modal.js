document.addEventListener('click', event => {
  const target = event.target
  if (!(target instanceof Element)) return

  const opener = target.closest('[data-modal-open]')
  if (opener) document.getElementById(opener.getAttribute('data-modal-open'))?.showModal()

  const closer = target.closest('[data-modal-close]')
  if (closer) closer.closest('dialog')?.close()

  if (target instanceof HTMLDialogElement) target.close()
})
