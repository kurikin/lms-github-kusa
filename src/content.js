require("./style.css");

import {
    ApolloClient,
    InMemoryCache,
    gql,
    createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const token = process.env.API_KEY;

const httpLink = createHttpLink({
    uri: "https://api.github.com/graphql",
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

(async () => {
    console.log("Hello!");
    console.log(token);

    client
        .query({
            query: gql`
                query ($userName: String!) {
                    user(login: $userName) {
                        contributionsCollection {
                            contributionCalendar {
                                totalContributions
                                weeks {
                                    contributionDays {
                                        contributionCount
                                        date
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                userName: "kurikin",
            },
        })
        .then((result) => console.log(result));

    const targetElement = document.getElementsByClassName("base")[0];
    const baseHtml = createBaseHtml();

    targetElement.insertAdjacentHTML("afterbegin", baseHtml);

    const squares = document.querySelector(".squares");
    for (var i = 1; i < 365; i++) {
        const level = Math.floor(Math.random() * 3);
        squares.insertAdjacentHTML(
            "beforeend",
            `<li data-level="${level}"></li>`
        );
    }
})();

function createBaseHtml() {
    return `
        <div class="graph">
        <ul class="months">
            <li>Jan</li>
            <li>Feb</li>
            <li>Mar</li>
            <li>Apr</li>
            <li>May</li>
            <li>Jun</li>
            <li>Jul</li>
            <li>Aug</li>
            <li>Sep</li>
            <li>Oct</li>
            <li>Nov</li>
            <li>Dec</li>
        </ul>
        <ul class="days">
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
        </ul>
        <ul class="squares">
        </ul>
        </div>`;
}
