import logo from './logo.png'
function Footer() {
    return (
        <>
        <hr className="linea" />
            <div id="footerStyle">

                <div id="cajaLogo">
                    <img className="logo" src={logo} />
                </div>
                <div id="namesFooter">
                    <p>Proyecto final BBK Bootcamp </p>
                    <p>Alicia Delgado</p>
                    <p>Leire Barturen</p>
                    <p>Iratxe Barrio</p>
                </div>
            </div>

        </>
    )
}

export default Footer;