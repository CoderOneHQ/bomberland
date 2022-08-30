import * as React from "react";
import styled from "styled-components";
import { RouterLink } from "../RouterLink/RouterLink";
import { useBuild } from "../../hooks/engine-api/useBuild";
import { BomberlandRoute } from "../../utilities/BomberlandRoute";
import { ClientFooter } from "../ClientFooter/ClientFooter";
import { Palette } from "../../theme/Palette";

const Root = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Container = styled.div`
    margin: 0 auto;
    text-align: center;
    color: ${Palette.Neutral100};
`;

const Button = styled.div`
    cursor: pointer;
    border-radius: 4px;
    background-color: ${Palette.Neutral20};
    padding: 8px 16px;
    color: ${Palette.Neutral100};
    text-align: center;
    transition: background-color 100ms ease;

    :hover {
        background-color: ${Palette.Neutral30};
    }

    :active {
        background-color: ${Palette.Neutral10};
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 16px;
`;

const Heading = styled.h1`
    font-size: 36px;
    font-weight: 700;
    padding-top: 16px;
`;

export const IndexContent: React.FC<React.PropsWithChildren<unknown>> = () => {
    const buildData = useBuild();
    if (buildData.status === "loading") {
        return <>Loading</>;
    }
    return (
        <>
            <Root>
                <Container>
                    <Heading>Bomberland</Heading>
                    <p>
                        <strong>Engine build version: </strong>
                        <span>{buildData.data?.build}</span>
                    </p>
                    <ButtonContainer>
                        <RouterLink href={BomberlandRoute.Game}>
                            <Button>Game client</Button>
                        </RouterLink>
                        <RouterLink href={BomberlandRoute.DocumentationIndex}>
                            <Button>Docs</Button>
                        </RouterLink>
                        <RouterLink href={BomberlandRoute.Replays}>
                            <Button>Replays</Button>
                        </RouterLink>
                    </ButtonContainer>
                </Container>
                <ClientFooter />
            </Root>
        </>
    );
};
