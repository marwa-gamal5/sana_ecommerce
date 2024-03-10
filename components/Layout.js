
import FixedNavbar from './FixedNavbar/FixedNavbar';
import Footer from './Footer/Footer';

function Layout(props) {
    return (
        <>
            <FixedNavbar />
            {props.children}
            <Footer />
        </>
    )
}

export default Layout;



