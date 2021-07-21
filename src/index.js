(async () => {
  /********BE CAREFUL WHAT YOU DELETE BELOW THIS LINE********/

  // Get the configuration information from the config.js file
  const config = await await fetch("config").then(response => response.json());

  // Create a JWT token for authenticating the user to a QCS session
  const token = await await fetch("token").then(response => response.json());

  const login = await await fetch(
    `https://${config.tenantDomain}/login/jwt-session?qlik-web-integration-id=${config.qlikWebIntegrationId}`,
    {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token.token}`,
        "qlik-web-integration-id": config.qlikWebIntegrationId
      },
      rejectunAuthorized: false
    }
  );

  //Get the cross-site scripting token to allow requests to QCS from the web app
  const csrfTokenInfo = await await fetch(
    `https://${config.tenantDomain}/api/v1/csrf-token?qlik-web-integration-id=${config.qlikWebIntegrationId}`,
    {
      credentials: "include",
      headers: {
        "Qlik-Web-Integration-ID": config.qlikWebIntegrationId
      }
    }
  );

  // Build the websocket URL to connect to the Qlik Sense applicaiton
  const url = `wss://${config.tenantDomain}/app/${
    config.appId
  }?qlik-web-integration-id=${
    config.qlikWebIntegrationId
  }&qlik-csrf-token=${csrfTokenInfo.headers.get("qlik-csrf-token")}`;

  // Fetch the schema for communicating with Qlik's engine API
  const schema = await (await fetch(
    "https://unpkg.com/enigma.js/schemas/3.2.json"
  )).json();

  // Create Qlik engine session
  const session = window.enigma.create({ schema, url });

  // Open the application
  const app = await (await session.open()).openDoc(config.appId);

  /********BE CAREFUL WHAT YOU DELETE ABOVE THIS LINE********/

  const themeFile = await await fetch("theme/horizon").then(response =>
    response.json()
  );
  //console.log(themeFile);

  // Create embed configuration
  const nuked = window.stardust.embed(app, {
    context: { theme: "horizon" },
    types: [
      {
        name: "mekko",
        load: () => Promise.resolve(window["sn-mekko-chart"])
      },
      {
        name: "barchart",
        load: () => Promise.resolve(window["sn-bar-chart"])
      },

      {
        name: "action-button",
        load: () => Promise.resolve(window["sn-action-button"])
      },
      {
        name: "gridchart",
        load: () => Promise.resolve(window["sn-grid-chart"])
      }
    ]
  });

  (await nuked.selections()).mount(document.querySelector(".toolbar"));

  nuked.render({
    element: document.querySelector(".object"),
    id: "XHRqzeG"
  }),
    nuked.render({
      element: document.querySelector(".object"),
      id: "yxMet"
    }),
    nuked.render({
      element: document.querySelector(".object"),
      type: "mekko",
      fields: ["Type", "Effect_1", "=count(Effect_1)"]
    }),
    nuked.render({
      element: document.querySelector(".object"),
      id: "HeebnW"
    });

  var buttonn = document.getElementById("mybutton");
  buttonn.onclick = function() {
    myFunction();
  };
  let permittedValues;
  function myFunction() {
    var messsage = $("#user-input").val();
    console.log(messsage);

    fetch("/wordembed", {
      method: "POST",
      body: JSON.stringify({ hi: messsage }),
      headers: new Headers({ "Content-Type": "application/json" })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        var js_data = [data];
        console.log(js_data);
        permittedValues = data.map(value => value.word);
        console.log(permittedValues);

        picasso.chart({
          element: document.querySelector(".container"),
          data: [
            {
              type: "matrix",
              data: data
            }
          ],
          //js_data,
          settings: {
            scales: {
              y: {
                data: { field: "dist" },
                invert: true,
                include: [0]
              },
              c: {
                data: { field: "dist" },
                type: "color"
              },
              t: { data: { extract: { field: "word" } }, padding: 0.3 }
            },
            components: [
              {
                type: "axis",
                dock: "left",
                scale: "y"
              },
              {
                type: "axis",
                dock: "bottom",
                scale: "t"
              },
              {
                key: "bars",
                type: "box",
                data: {
                  extract: {
                    field: "word",
                    props: {
                      start: 0,
                      end: { field: "dist" }
                    }
                  }
                },
                settings: {
                  major: { scale: "t" },
                  minor: { scale: "y" },
                  box: {
                    fill: { scale: "c", ref: "end" }
                  }
                }
              },
              ,
            ]
          }
        });
      });

    fetch("/data")
      .then(response => response.json())
      .then(d => {
        const new_y = d.map(value => JSON.parse(value.y));
        const new_x = d.map(value => JSON.parse(value.x));
        const new_w = d.map(value => value.word);
        console.log(new_x);
        const arr = [["x", "y", "word"]];
        for (let i = 0; i < d.length; i++) {
          arr.push([new_x[i], new_y[i], new_w[i]]);
        }
        console.log(arr);

        picasso.chart({
          element: document.querySelector(".container_new"),
          data: [
            {
              type: "matrix",
              data: arr
            }
          ],
          settings: {
            scales: {
              s: {
                data: {
                  field: "y"
                },
                expand: 0.2,
                invert: true
              },
              m: {
                data: {
                  field: "x"
                },
                expand: 0.1
              },
              col: {
                data: { extract: { field: "word" } },
                type: "color"
              }
            },
            interactions: [
              {
                type: "native",
                events: {
                  mousemove(e) {
                    const tooltip = this.chart.component("t");
                    tooltip.emit("show", e);
                  },
                  mouseleave(e) {
                    const tooltip = this.chart.component("t");
                    tooltip.emit("hide");
                  }
                }
              }
            ],
            components: [
              {
                key: "y-axis",
                type: "axis",
                scale: "s",
                dock: "left"
              },
              {
                key: "t",
                type: "tooltip"
              },
              {
                type: "legend-cat",
                dock: "right",
                scale: "col"
              },
              {
                key: "x-axis",
                type: "axis",
                scale: "m",
                dock: "bottom"
              },
              {
                key: "p",
                type: "point",
                // options: { noTooltip: true },
                data: {
                  extract: {
                    field: "word",
                    props: {
                      y: { field: "y" },
                      x: { field: "x" },
                      group: { field: "word" }
                    }
                  }
                },
                settings: {
                  x: { scale: "m" },
                  y: { scale: "s" },
                  shape: "circle",
                  size: 0.3,
                  strokeWidth: 2,
                  stroke: "#fff",
                  opacity: 0.8,
                  fill: { scale: "col", ref: "group" }
                }
              }
            ]
          }
        });
      });
  }
})();
