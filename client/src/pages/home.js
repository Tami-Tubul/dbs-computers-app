import { Button, Container, HStack, Image, Text } from "@chakra-ui/react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Navigation from "../components/navigation";
import api from "../services/api";
import authUser from "../services/authUser";
import { useSelector } from "react-redux";

export default function Home() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.userReducer.token);
  const connectedUserName = useSelector(
    (state) => state.userReducer.nameOfUser
  );

  const handleSignOut = async () => {
    try {
      const resp = await api.epLogout(token);
      if (resp.status === 200) {
        authUser.deleteToken();
        navigate("/login");
        alert(resp.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Container variant="header" as={"header"}>
        <HStack w="100%" maxW="100%" gap="30px">
          <Link to="/">
            <Image
              src="/assets/images/logo.jpg"
              alt="לוגו DBS"
              width={120}
              height={50}
            />
          </Link>
          <Navigation />
          <HStack>
            <Text variant="runingText">{`שלום ${connectedUserName}`}</Text>
            <Button variant="link" onClick={handleSignOut}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: "scale(-1, 1)" }}
              >
                <path
                  d="M10 2H3C1.9 2 1 2.9 1 4V20C1 21.1 1.9 22 3 22H10V20H3V4H10V2ZM21 11L16 6V9H9V15H16V18L21 13V11Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </HStack>
        </HStack>
      </Container>
      <Container variant={"main"} as={"main"}>
        <Outlet />
      </Container>
    </>
  );
}
