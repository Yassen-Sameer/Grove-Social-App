export default async function scrollToTop() {
  await window.scrollTo({ top: 0, behavior: "smooth" });

  window.location.href = import.meta.env.BASE_URL;

  
}
