import Head from "next/head";
import Image from "next/image";
import { ReactNode } from "react";
import { Button, MenuDropdown, WalletOptionsModal } from "..";
import { useAccount } from "wagmi";
import Link from "next/link";

interface Props {
  children: ReactNode;
  showWalletOptions: boolean;
  setShowWalletOptions: (showWalletOptions: boolean) => void;
}

export default function Layout(props: Props) {
  const { children, showWalletOptions, setShowWalletOptions } = props;

  const [{ data: accountData, loading }, disconnect] = useAccount({
    fetchEns: true,
  });

  const renderLabel = () => {
    if (accountData?.ens) {
      return (
        <>
          <div className="relative w-8 h-8 mr-2">
            {accountData.ens.avatar ? (
              <Image
                src={accountData?.ens.avatar}
                alt="ENS Avatar"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            ) : (
              <Image
                src="/images/black-gradient.png"
                alt="ENS Avatar"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            )}
          </div>
          <span className="truncate max-w-[100px]">
            {accountData.ens?.name}
          </span>
        </>
      );
    }

    return (
      <span className="truncate max-w-[150px]">{accountData?.address}</span>
    );
  };

  const renderButton = () => {
    if (accountData) {
      return (
        <MenuDropdown
          label={renderLabel()}
          options={[{ label: "Disconnect", onClick: disconnect }]}
        />
      );
    }

    return (
      <Button
        loading={loading || showWalletOptions}
        onClick={() => setShowWalletOptions(true)}
      >
        CONNECT
      </Button>
    );
  };

  return (
    <div>
      <Head>
        <title>The Last Lands</title>
        <meta name="description" content="The Last lands" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WalletOptionsModal
        open={showWalletOptions}
        setOpen={setShowWalletOptions}
      />
      {/* bg-gradient-to-r from-primary to-white */}
      <div className="absolute w-screen ">
        <div className="flex items-center justify-between px-4 my-2">
          <div className="flex items-center">
            {/*
              https://www.fontget.com/font/squirk/
              #586AE8 */}
            <img src="/text-logo.png" className="w-60" />
            {/* <h4 className="text-2xl font-bold text-white cursor-default">
              The Last Lands
            </h4> */}
          </div>
          <div className="flex flex-row text-primary ">
            <Link href="/demo">
              <span className="mx-8 hover:underline hover:text-white">
                Game simulation
              </span>
            </Link>
            <a
              href="https://docs.thelastlands.com/docs/introduction"
              className="mx-8 hover:underline hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </a>
            <span className="ml-8 hover:underline hover:text-white">
              {renderButton()}
            </span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
