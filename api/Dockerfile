FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Chiro.API/Chiro.API.csproj", "Chiro.API/"]
COPY ["Chiro.Application/Chiro.Application.csproj", "Chiro.Application/"]
COPY ["Chiro.Domain/Chiro.Domain.csproj", "Chiro.Domain/"]
COPY ["Chiro.Infra/Chiro.Infra.csproj", "Chiro.Infra/"]
COPY ["Chiro.Persistence/Chiro.Persistence.csproj", "Chiro.Persistence/"]
RUN dotnet restore "Chiro.API/Chiro.API.csproj"
COPY . .
WORKDIR "/src/Chiro.API"
RUN dotnet build "Chiro.API.csproj" -c ${BUILD_CONFIGURATION} -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Chiro.API.csproj" -c ${BUILD_CONFIGURATION} -o /app/publish

FROM base AS final
ENV JWT-ISSUER dispo@gmail.com
ENV JWT-KEY ZP0AkyIvItZIJUNkNO8BbS4SR9VVEyab
ENV CONNECTION-STRING Host=chiro-homolog.cx0gguaogyvl.us-east-1.rds.amazonaws.com; Port=5432; Username=postgres; Password=0PTti#ux&JJM*yuCA^jF; Database=chiro_hom
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT [ "dotnet", "Chiro.API.dll" ]