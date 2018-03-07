FROM electronuserland/builder:wine-02.18



RUN mkdir /hostHome

RUN apt-get update && apt-get install -y libusb-1.0 nasm graphicsmagick autoconf automake libtool python-pip

# RUN useradd -ms /bin/bash builder
# USER builder
# WORKDIR /home/builder
# ENV HOME /home/builder

RUN pip install awscli --upgrade --user

ENV PATH "$PATH:/root/.local/bin"

# VOLUME ["/appDir"]

# WORKDIR /appDir

# ENTRYPOINT [ "/bin/bash", "-c" ]
