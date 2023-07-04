import {PageImg} from "../components/pageImg";
import {HomeFour} from "../components/homeFour";
import {BMap} from "../components/bMap";
import {ContactForm} from "../components/contactForm";

export const Contact = () => {
    return(
        <>
            <div className={"pubP"}>
                <PageImg pageId={'e'} width={'100%'} height={'800px'} margin={'0'} imgUrl={''} imgWidth={"120%"}/>
                <HomeFour width={"90%"} height={"395px"} margin={"0 auto"} />
                <BMap width={"80%"} height={"460px"} margin={"30px auto"}/>
                <ContactForm width={"80%"} height={"288"} margin={"100px auto"}/>
            </div>
        </>
    )
}