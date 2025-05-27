export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className=" border-t flex-center">
      {currentYear} NoTCiS. All Rights Reserved
    </footer>
  );
}
