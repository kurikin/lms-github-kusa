require("./style.css");

import {
    ApolloClient,
    InMemoryCache,
    gql,
    createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const token = process.env.API_KEY;
const query = gql`
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
`;

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
    console.log(token);

    const {
        data: {
            user: {
                contributionsCollection: {
                    contributionCalendar: { totalContributions, weeks },
                },
            },
        },
    } = await client.query({
        query: query,
        variables: {
            userName: "kurikin",
        },
    });

    const contributions = [];

    console.log(weeks);

    weeks.forEach((week) => {
        week.contributionDays.forEach((day) => {
            contributions.push(day.contributionCount);
        });
    });

    const parentElement = document.getElementsByClassName("base")[0];
    const baseHtml = createBaseHtml();

    parentElement.insertAdjacentHTML("afterbegin", baseHtml);

    const maxCount = Math.max(...contributions);

    const squares = document.querySelector(".squares");

    console.log(contributions);

    for (var i = 1; i < 365; i++) {
        let level = -1;

        if (contributions[i] === 0) {
            level = 0;
        } else if (contributions[i] < maxCount / 4) {
            level = 1;
        } else if (contributions[i] < maxCount / 2) {
            level = 2;
        } else {
            level = 3;
        }

        console.log(level);

        squares.insertAdjacentHTML(
            "beforeend",
            `<li data-level=${level}></li>`
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
